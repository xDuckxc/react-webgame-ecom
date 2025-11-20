import argparse
import csv
import datetime
import os
import time
import uuid
from pathlib import Path
from typing import Dict, List, Optional

import requests
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    Integer,
    String,
    Text,
    create_engine,
    func,
)
from sqlalchemy.orm import declarative_base, Session, sessionmaker

API_URL = "https://www.freetogame.com/api/games"

# --- Your declared genres (authoritative list) ---
DECLARED_GENRES: List[str] = [
    "Shooter",
    "MMORPG",
    "Battle Royal",
    "Strategy",
    "ARPG",
    "Action RPG",
    "MMOARPG",
    "Fighting",
    "RPG",
    "Sports",
    "MMO",
    "Card Game",
    "Dungeon Crawler",
    "MOBA",
    "Action Game",
    "Action",
    "Racing",
    "Social",
    " MMORPG",
    "Fantasy",
]

# --- Minimal, safe canonicalization ---
# Only fix obvious whitespace and a common misspelling while keeping distinct labels as-is
ALIAS: Dict[str, str] = {
    "Battle Royal": "Battle Royale",  # common typo -> canonical
    " MMORPG": "MMORPG",  # leading space -> stripped
}


def canon_genre(raw):
    if raw is None:
        return None
    s = str(raw)
    # 1) apply alias if exact key matches (before strip, to catch leading space case)
    if s in ALIAS:
        s = ALIAS[s]
    # 2) trim leftover surrounding whitespace
    s = s.strip()
    return s


def safe_filename(genre: str) -> str:
    # Lowercase, spaces to underscores; keep others unchanged
    return f"{genre.lower().replace(' ', '_')}.csv"


# --- Database (SQLAlchemy + MySQL) ---
Base = declarative_base()


class Product(Base):
    """Match Prisma Product schema (MySQL)."""

    __tablename__ = "Product"

    id = Column(String(191), primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Integer, nullable=False, default=0)
    originalPrice = Column(Integer, nullable=True)
    image = Column(String(512), nullable=True)
    category = Column(String(100), nullable=False)
    rating = Column(Float, nullable=False, default=0)
    isNew = Column(Boolean, nullable=False, default=False)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


def get_db_url(cli_url: Optional[str] = None) -> str:
    """Pick DB URL from CLI > env > default localhost."""
    return cli_url or os.getenv("DATABASE_URL") or "mysql+pymysql://root:root@localhost:3306/game_ecom"


def get_session(db_url: str) -> Session:
    engine = create_engine(db_url, pool_pre_ping=True, future=True)
    Base.metadata.create_all(engine)
    return sessionmaker(bind=engine, expire_on_commit=False)()


def upsert_products(session: Session, products: List[Product]) -> int:
    """Insert/update Product rows by id. Returns count of rows touched."""
    touched = 0
    for incoming in products:
        existing = session.get(Product, incoming.id)
        if existing:
            existing.title = incoming.title
            existing.description = incoming.description
            existing.price = incoming.price
            existing.originalPrice = incoming.originalPrice
            existing.image = incoming.image
            existing.category = incoming.category
            existing.rating = incoming.rating
            existing.isNew = incoming.isNew
            existing.updatedAt = datetime.datetime.now()
        else:
            session.add(incoming)
        touched += 1
    session.commit()
    return touched


# --- Helper: Build genre index with deduplication ---
from collections import defaultdict


def build_genre_index(games):
    """Return mapping: canonical_genre -> list of unique games (deduped by id)."""
    buckets = defaultdict(list)
    seen_per_genre = defaultdict(set)
    for g in games:
        cg = canon_genre(g.get("genre"))
        gid = g.get("id")
        if cg is None or gid is None:
            continue
        if gid in seen_per_genre[cg]:
            continue  # skip duplicates within same genre
        seen_per_genre[cg].add(gid)
        buckets[cg].append(g)
    return buckets


def fetch_all_stock_data(_ignored=None):
    """Fetch ALL games in a single call. We'll split by genre locally to avoid any mixing."""
    url = API_URL
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        if not isinstance(data, list):
            print(f"API message: {data}")
            return None
        print(f"\n[{datetime.datetime.now()}] Retrieved {len(data)} total records from API")
        return data
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None


def save_to_csv(genre: str, games: List[dict]) -> int:
    """Save ONLY rows that match the EXACT canonicalized genre to this CSV. Returns rows written."""
    filename = safe_filename(genre)
    written = 0
    seen_ids = set()
    with open(filename, "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(
            [
                "id",
                "title",
                "genre",
                "platform",
                "publisher",
                "developer",
                "release_date",
                "short_description",
                "game_url",
                "thumbnail",  # รูปปกจาก API
            ]
        )
        for g in games:
            if canon_genre(g.get("genre")) != genre:
                continue
            gid = g.get("id")
            if gid in seen_ids:
                continue  # avoid duplicate ids within the same CSV
            seen_ids.add(gid)
            writer.writerow(
                [
                    g.get("id"),
                    g.get("title"),
                    g.get("genre"),
                    g.get("platform"),
                    g.get("publisher"),
                    g.get("developer"),
                    g.get("release_date"),
                    g.get("short_description"),
                    g.get("game_url"),
                    g.get("thumbnail"),
                ]
            )
            written += 1
    print(f"✅ Saved {written} games to {filename}")
    return written


def import_csv_dir(csv_dir: Path, db_url: Optional[str]) -> int:
    """Import all *.csv in a folder into the Product table."""
    session = get_session(get_db_url(db_url))
    files = sorted(csv_dir.glob("*.csv"))
    if not files:
        print(f"ไม่มีไฟล์ CSV ในโฟลเดอร์ {csv_dir}")
        return 0

    total_rows = 0
    for file in files:
        with open(file, newline="") as f:
            reader = csv.DictReader(f)
            products = []
            for row in reader:
                pid = str(row.get("id") or uuid.uuid4())
                now = datetime.datetime.now()
                products.append(
                    Product(
                        id=pid,
                        title=row.get("title") or f"Game {pid}",
                        description=row.get("short_description"),
                        # FreeToGame เป็นเกมฟรี จึงตั้งราคา 0 ให้ตรง schema
                        price=0,
                        originalPrice=None,
                        image=row.get("thumbnail") or None,
                        category=canon_genre(row.get("genre")) or "Unknown",
                        rating=0,
                        isNew=False,
                        createdAt=now,
                        updatedAt=now,
                    )
                )
            if products:
                touched = upsert_products(session, products)
                total_rows += touched
                print(f"✅ นำเข้า {touched} แถวจาก {file.name} ลงฐานข้อมูลแล้ว")
    print(f"\nรวมทั้งหมด {total_rows} แถวที่ถูก upsert เข้า DB จาก {len(files)} ไฟล์")
    return total_rows


def export_from_api_to_csv() -> None:
    """Fetch from FreeToGame API then write CSV แยกตาม genre."""
    all_games = fetch_all_stock_data(None)
    if not all_games:
        return

    # Canonical, allowed genres based on your list
    allowed = sorted({canon_genre(g) for g in DECLARED_GENRES if canon_genre(g)})
    print(f"Allowed genres ({len(allowed)}): {allowed}")

    # Build index (dedup by id within each canonical genre)
    idx = build_genre_index(all_games)

    print("\nPer-genre unique counts (from API, canonicalized):")
    for gname in sorted(idx.keys()):
        print(f"  - {gname}: {len(idx[gname])}")

    # Summaries
    total_api = len({g.get("id") for g in all_games if g.get("id") is not None})
    total_written = 0
    missing_genre = [g for g in all_games if canon_genre(g.get("genre")) is None]
    not_allowed = [
        g
        for g in all_games
        if (canon_genre(g.get("genre")) is not None and canon_genre(g.get("genre")) not in allowed)
    ]

    # Write one CSV per allowed genre
    for genre in allowed:
        subset = idx.get(genre, [])
        total_written += save_to_csv(genre, subset)
        time.sleep(0.25)  # polite tiny delay

    # Validation report
    print("\n=== VALIDATION SUMMARY ===")
    print(f"Total unique games in API: {total_api}")
    print(f"Total rows written across allowed genres: {total_written}")
    print(f"Games with missing/None genre (excluded): {len(missing_genre)}")
    print(f"Games with genres not in allowed list (excluded): {len(not_allowed)}")

    # Optional: warn if totals don't align
    if total_written != total_api - len(missing_genre) - len(not_allowed):
        print("⚠️ WARNING: Totals do not align.")
        print(
            "- Possible causes: API genres outside your declared list, spelling variants not in ALIAS, or unexpected nulls."
        )
        print("- Tip: Add mappings to ALIAS for any additional variants you see printed above.")


def main():
    parser = argparse.ArgumentParser(
        description="ดึงข้อมูลเกม (FreeToGame) -> CSV และ/หรือนำเข้า CSV ลง MySQL (schema Prisma) ด้วย Python"
    )
    parser.add_argument(
        "--fetch",
        action="store_true",
        help="ดึงข้อมูลจาก API แล้วแตกไฟล์ CSV ตาม genre (ใช้ allowed list ด้านบน)",
    )
    parser.add_argument(
        "--import-db",
        action="store_true",
        help="นำเข้าไฟล์ CSV (*.csv ในโฟลเดอร์ที่กำหนด) ลงฐานข้อมูล",
    )
    parser.add_argument(
        "--csv-dir",
        default=".",
        help="โฟลเดอร์ที่เก็บไฟล์ CSV (default: โฟลเดอร์ปัจจุบัน)",
    )
    parser.add_argument(
        "--db-url",
        default=None,
        help="เชื่อมต่อฐานข้อมูล (override DATABASE_URL); ตัวอย่าง mysql+pymysql://user:pass@localhost:3306/game_ecom",
    )
    args = parser.parse_args()

    did_work = False

    if args.fetch:
        export_from_api_to_csv()
        did_work = True

    if args.import_db:
        import_csv_dir(Path(args.csv_dir), args.db_url)
        did_work = True

    if not did_work:
        parser.print_help()


if __name__ == "__main__":
    main()
