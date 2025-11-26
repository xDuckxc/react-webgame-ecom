import argparse
import csv
import datetime
import os
import time
import uuid
import random
import string
from pathlib import Path
from typing import Dict, List, Optional
from collections import defaultdict

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
    ForeignKey
)
from sqlalchemy.orm import declarative_base, Session, sessionmaker

API_URL = "https://www.freetogame.com/api/games"

# --- 1. CONFIGURATION & MODELS ---
DEFAULT_DB_URL = "mysql+pymysql://root:root@127.0.0.1:8889/game_ecom"

Base = declarative_base()

class Product(Base):
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

class ProductKey(Base):
    __tablename__ = "ProductKey"

    id = Column(String(191), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(191), unique=True, nullable=False)
    isUsed = Column(Boolean, default=False)
    productId = Column(String(191), ForeignKey("Product.id"), nullable=False)
    orderId = Column(String(191), nullable=True)

# --- 2. DATABASE UTILS ---
def get_db_url(cli_url: Optional[str] = None) -> str:
    return cli_url or os.getenv("DATABASE_URL") or DEFAULT_DB_URL

def get_session(db_url: str) -> Session:
    engine = create_engine(db_url, pool_pre_ping=True, future=True)
    Base.metadata.create_all(engine)
    return sessionmaker(bind=engine, expire_on_commit=False)()

def upsert_products(session: Session, products: List[Product]) -> int:
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

# --- 3. FETCH & CSV LOGIC ---
DECLARED_GENRES: List[str] = [
    "Shooter", "MMORPG", "Battle Royal", "Strategy", "ARPG",
    "Action RPG", "MMOARPG", "Fighting", "RPG", "Sports",
    "MMO", "Card Game", "Dungeon Crawler", "MOBA", "Action Game",
    "Action", "Racing", "Social", " MMORPG", "Fantasy",
]

ALIAS: Dict[str, str] = {
    "Battle Royal": "Battle Royale",
    " MMORPG": "MMORPG",
}

def canon_genre(raw):
    if raw is None: return None
    s = str(raw)
    if s in ALIAS: s = ALIAS[s]
    return s.strip()

def safe_filename(genre: str) -> str:
    return f"{genre.lower().replace(' ', '_')}.csv"

def generate_realistic_pricing(release_date_str: str, genre: str):
    price_tiers = [0, 0, 0, 199, 299, 390, 490, 590, 690, 790, 890, 990, 1090, 1290, 1490, 1690, 1890, 1990, 2190]
    year = 2020
    try:
        if release_date_str: year = int(release_date_str.split('-')[0])
    except: pass

    current_year = datetime.datetime.now().year
    if current_year - year > 5: base_price = random.choice(price_tiers[:8])
    elif current_year - year <= 2: base_price = random.choice(price_tiers[7:])
    else: base_price = random.choice(price_tiers)

    if base_price > 0 and random.random() < 0.3:
        fake_original = int(base_price * random.uniform(1.2, 1.5))
        original_price = (fake_original // 10) * 10 + 9 
        return base_price, original_price
    else:
        return base_price, None

def fetch_all_stock_data(_ignored=None):
    try:
        print(f"📡 Fetching data from {API_URL}...")
        response = requests.get(API_URL)
        response.raise_for_status()
        data = response.json()
        if not isinstance(data, list): return None
        print(f"✅ Retrieved {len(data)} records.")
        return data
    except Exception as e:
        print(f"❌ Error fetching data: {e}")
        return None

def build_genre_index(games):
    buckets = defaultdict(list)
    seen_per_genre = defaultdict(set)
    for g in games:
        cg = canon_genre(g.get("genre"))
        gid = g.get("id")
        if cg is None or gid is None: continue
        if gid in seen_per_genre[cg]: continue 
        seen_per_genre[cg].add(gid)
        buckets[cg].append(g)
    return buckets

def save_to_csv(genre: str, games: List[dict], csv_dir: str = ".") -> int:
    filename = os.path.join(csv_dir, safe_filename(genre))
    written = 0
    seen_ids = set()
    
    # Ensure directory exists
    os.makedirs(csv_dir, exist_ok=True)

    with open(filename, "w", newline="", encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(["id", "title", "genre", "platform", "publisher", "developer", "release_date", "short_description", "game_url", "thumbnail", "price", "original_price"])
        for g in games:
            if canon_genre(g.get("genre")) != genre: continue
            gid = g.get("id")
            if gid in seen_ids: continue
            seen_ids.add(gid)

            price, original_price = generate_realistic_pricing(g.get("release_date"), genre)

            writer.writerow([
                g.get("id"), g.get("title"), g.get("genre"), g.get("platform"), g.get("publisher"),
                g.get("developer"), g.get("release_date"), g.get("short_description"), g.get("game_url"),
                g.get("thumbnail"), price, original_price
            ])
            written += 1
    print(f"💾 Saved {written} games to {filename}")
    return written

def export_from_api_to_csv(csv_dir: str) -> None:
    all_games = fetch_all_stock_data(None)
    if not all_games: return

    allowed = sorted({canon_genre(g) for g in DECLARED_GENRES if canon_genre(g)})
    idx = build_genre_index(all_games)
    total_written = 0

    for genre in allowed:
        subset = idx.get(genre, [])
        if subset:
            total_written += save_to_csv(genre, subset, csv_dir)
            time.sleep(0.1)
    
    print(f"\n✨ CSV Export Complete. Total {total_written} rows written.")

def import_csv_dir(csv_dir: Path, db_url: Optional[str]) -> int:
    print(f"\n📥 Importing CSVs from {csv_dir} to Database...")
    session = get_session(get_db_url(db_url))
    files = sorted(csv_dir.glob("*.csv"))
    if not files:
        print(f"⚠️ No CSV files found in {csv_dir}")
        return 0

    total_rows = 0
    for file in files:
        try:
            with open(file, newline="", encoding='utf-8') as f:
                reader = csv.DictReader(f)
                products = []
                for row in reader:
                    pid = str(row.get("id") or uuid.uuid4())
                    now = datetime.datetime.now()
                    
                    try: price_val = int(row.get("price", 0))
                    except: price_val = 0
                    
                    try:
                        orig = row.get("original_price")
                        orig_price_val = int(orig) if orig and orig != 'None' else None
                    except: orig_price_val = None

                    is_new = False
                    if row.get("release_date") and str(now.year) in str(row.get("release_date")):
                        is_new = True

                    products.append(Product(
                        id=pid,
                        title=row.get("title") or f"Game {pid}",
                        description=row.get("short_description"),
                        price=price_val,
                        originalPrice=orig_price_val,
                        image=row.get("thumbnail") or None,
                        category=canon_genre(row.get("genre")) or "Unknown",
                        rating=round(random.uniform(3.5, 5.0), 1),
                        isNew=is_new,
                        createdAt=now,
                        updatedAt=now,
                    ))
                if products:
                    touched = upsert_products(session, products)
                    total_rows += touched
                    print(f"   - {file.name}: Imported {touched} items.")
        except Exception as e:
            print(f"❌ Error reading {file.name}: {e}")

    print(f"✅ Database Import Complete. Total {total_rows} products upserted.")
    return total_rows

# --- 4. KEY GENERATION LOGIC ---
def generate_key_code(prefix="GAME"):
    def random_segment(length=4):
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
    return f"{prefix}-{random_segment()}-{random_segment()}-{random_segment()}"

def generate_keys_for_products(db_url: str, count_per_product: int = 5):
    session = get_session(db_url)
    try:
        products = session.query(Product).all()
        print(f"\n🔑 Generating keys for {len(products)} products ({count_per_product} keys each)...")
        
        total_keys_created = 0
        for product in products:
            for _ in range(count_per_product):
                new_key = ProductKey(
                    id=str(uuid.uuid4()),
                    code=generate_key_code(),
                    isUsed=False,
                    productId=product.id
                )
                session.add(new_key)
                total_keys_created += 1
        
        session.commit()
        print(f"✅ Successfully generated {total_keys_created} keys.")
    except Exception as e:
        session.rollback()
        print(f"❌ Error generating keys: {e}")
    finally:
        session.close()

# --- 5. MAIN ---
def main():
    parser = argparse.ArgumentParser(description="Game E-com Manager")
    parser.add_argument("--fetch", action="store_true", help="Fetch API -> CSV")
    parser.add_argument("--import-db", action="store_true", help="CSV -> Database")
    parser.add_argument("--generate-keys", type=int, nargs='?', const=5, help="Generate Keys for all products")
    parser.add_argument("--csv-dir", default=".", help="CSV Directory")
    parser.add_argument("--db-url", default=None, help="Database Connection URL")
    
    args = parser.parse_args()
    db_url = get_db_url(args.db_url)
    did_work = False

    if args.fetch:
        export_from_api_to_csv(args.csv_dir)
        did_work = True

    if args.import_db:
        import_csv_dir(Path(args.csv_dir), args.db_url)
        did_work = True

    if args.generate_keys is not None:
        generate_keys_for_products(db_url, int(args.generate_keys))
        did_work = True

    if not did_work:
        parser.print_help()

if __name__ == "__main__":
    main()