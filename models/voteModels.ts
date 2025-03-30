import { Vote, VoteAttributes } from './types';
import { Player } from './types';

// Vote structure example (for reference)
export const voteModel: Partial<Vote> = {
  id: '',
  playerId: '',
  voterId: '', // Could be user ID or name
  timestamp: new Date(),
  attributes: {}, // Will contain all player attributes with voted values
  comment: '', // Optional comment with the vote
};

// Calculate average stats from votes
export const calculateAverageStats = (votes: Vote[]): VoteAttributes => {
  if (!votes || votes.length === 0) return {};

  // Initialize sum object
  const sum: Record<string, number> = {};

  // Sum up all values for each attribute
  votes.forEach((vote) => {
    Object.entries(vote.attributes).forEach(([key, value]) => {
      sum[key] = (sum[key] || 0) + value;
    });
  });

  // Calculate average for each attribute
  const averages: VoteAttributes = {};
  Object.entries(sum).forEach(([key, total]) => {
    averages[key] = Math.round(total / votes.length);
  });

  return averages;
};

// Check if a voter has already voted for a player
export const hasVoted = (votes: Vote[], voterId: string, playerId: string): boolean => {
  return votes.some(
    (vote) => vote.voterId === voterId && vote.playerId === playerId
  );
};

// Calculate player's score based on votes
export const calculatePlayerScoreFromVotes = (votes: Vote[], player: Player): Player => {
  if (!votes || votes.length === 0) return player;

  // Get average stats from votes
  const averageStats = calculateAverageStats(votes);

  // Create a new player object with updated stats
  const updatedPlayer = { ...player };

  // Update each attribute with the average from votes
  Object.keys(averageStats).forEach((key) => {
    updatedPlayer[key] = averageStats[key];
  });

  return updatedPlayer;
};

// Validate vote values
export const validateVote = (vote: Partial<Vote>): boolean => {
  if (!vote.playerId || !vote.voterId || !vote.attributes) {
    return false;
  }

  // Check if all attributes are between 0 and 100
  return Object.values(vote.attributes).every(
    (value) => Number.isInteger(value) && value >= 0 && value <= 100
  );
};
