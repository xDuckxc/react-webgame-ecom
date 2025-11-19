import { NextResponse } from 'next/server';
// การ Import นี้ถูกต้องและจะดึง Global Instance ที่เพิ่งถูกแก้ไขใน src/lib/prisma.ts
import { prisma } from '@/lib/prisma';

/**
 * Handles GET requests to fetch a limited number of featured games.
 * This is the API endpoint called by the Home component (src/app/page.tsx).
 */
export async function GET() {
  try {
    // Line 11: prisma.game.findMany now correctly uses the globally defined client.
    const games = await prisma.game.findMany({ 
      take: 6,
      // Example: orderBy: { release_date: 'desc' }
    });

    // Return the games with a successful 200 status
    return NextResponse.json(games);

  } catch (error) {
    // Log the detailed error on the server side (Console ที่รัน Next.js)
    console.error('--- ERROR IN /api/games ---');
    console.error('Database query or connection failed:', error);
    console.error('----------------------------');

    // Return an explicit 500 Internal Server Error status
    return NextResponse.json(
      { error: 'Failed to retrieve games. Check Server Console for database connection issues.' },
      { status: 500 }
    );
  }
}