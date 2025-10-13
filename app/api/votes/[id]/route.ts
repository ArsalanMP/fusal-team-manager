import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETE /api/votes/[id] - Delete a vote
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.vote.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Vote deleted successfully' });
  } catch (error) {
    console.error('Error deleting vote:', error);
    return NextResponse.json(
      { error: 'Failed to delete vote' },
      { status: 500 }
    );
  }
}
