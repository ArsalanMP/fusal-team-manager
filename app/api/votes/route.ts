import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/votes - Get all votes
export async function GET() {
  try {
    const votes = await prisma.vote.findMany({
      include: {
        Player: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
    return NextResponse.json(votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    );
  }
}

// POST /api/votes - Create a new vote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerId, voterId, attributes, comment } = body;

    // Check if voter has already voted for this player
    const existingVote = await prisma.vote.findFirst({
      where: {
        playerId,
        voterId,
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted for this player' },
        { status: 400 }
      );
    }

    const vote = await prisma.vote.create({
      data: {
        playerId,
        voterId,
        attributes,
        comment,
      },
    });

    return NextResponse.json(vote, { status: 201 });
  } catch (error) {
    console.error('Error creating vote:', error);
    return NextResponse.json(
      { error: 'Failed to create vote' },
      { status: 500 }
    );
  }
}
