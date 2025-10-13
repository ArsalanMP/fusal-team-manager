"use client";
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Player, Vote } from "../models/types";

// Create a persistent atom for players
const playersAtom = atom<Player[]>([]);

// Create a persistent atom for modal state
const modalOpenAtom = atom<boolean>(false);

// Create a persistent atom for votes
const votesAtom = atom<Record<string, Vote[]>>({});

export function usePlayers() {
  const [players, setPlayers] = useAtom(playersAtom);

  const handleAddPlayer = async (newPlayer: Player) => {
    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlayer),
      });

      if (response.ok) {
        const createdPlayer = await response.json();
        setPlayers([...players, createdPlayer]);
      } else {
        console.error('Failed to add player');
      }
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  const handleUpdatePlayer = async (updatedPlayer: Player) => {
    try {
      const response = await fetch(`/api/players/${updatedPlayer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPlayer),
      });

      if (response.ok) {
        const updated = await response.json();
        setPlayers(
          players.map((player) =>
            player.id === updated.id ? updated : player
          )
        );
      } else {
        console.error('Failed to update player');
      }
    } catch (error) {
      console.error('Error updating player:', error);
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    try {
      const response = await fetch(`/api/players/${playerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPlayers(players.filter((player) => player.id !== playerId));
      } else {
        console.error('Failed to delete player');
      }
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  };

  const loadPlayers = async () => {
    try {
      const response = await fetch('/api/players');
      if (response.ok) {
        const playersData = await response.json();
        setPlayers(playersData);
      }
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  return {
    players,
    addPlayer: handleAddPlayer,
    updatePlayer: handleUpdatePlayer,
    deletePlayer: handleDeletePlayer,
    loadPlayers,
  };
}

export function usePlayerModal() {
  const [isModalOpen, setIsModalOpen] = useAtom(modalOpenAtom);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    isModalOpen,
    openModal,
    closeModal,
  };
}

export function useVoting() {
  const [votes, setVotes] = useAtom(votesAtom);

  const handleSubmitVote = async (vote: Partial<Vote> & { id?: string }) => {
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vote),
      });

      if (response.ok) {
        const createdVote = await response.json();
        // Update local state
        const updatedVotes = { ...votes };
        const playerId = vote.playerId || createdVote.playerId;
        if (!updatedVotes[playerId]) {
          updatedVotes[playerId] = [];
        }
        updatedVotes[playerId].push(createdVote);
        setVotes(updatedVotes);
        console.log("Vote submitted:", createdVote);
      } else {
        const error = await response.json();
        console.error('Failed to submit vote:', error);
        throw new Error(error.error || 'Failed to submit vote');
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      throw error;
    }
  };

  const handleDeleteVote = async (voteId: string) => {
    try {
      const response = await fetch(`/api/votes/${voteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update local state
        const updatedVotes = { ...votes };
        Object.keys(updatedVotes).forEach(playerId => {
          updatedVotes[playerId] = updatedVotes[playerId].filter(
            vote => vote.id !== voteId
          );
        });
        setVotes(updatedVotes);
      } else {
        console.error('Failed to delete vote');
      }
    } catch (error) {
      console.error('Error deleting vote:', error);
    }
  };

  // Get all votes or specific vote by id
  const getVotes = (id: string | null = null): Record<string, Vote[]> | Vote[] | null => {
    if (id) {
      return votes[id] || null;
    }
    return votes;
  };

  // Load votes from API
  const loadVotes = async () => {
    try {
      const response = await fetch('/api/votes');
      if (response.ok) {
        const votesData = await response.json();
        // Group votes by playerId
        const groupedVotes: Record<string, Vote[]> = {};
        votesData.forEach((vote: Vote) => {
          if (!groupedVotes[vote.playerId]) {
            groupedVotes[vote.playerId] = [];
          }
          groupedVotes[vote.playerId].push(vote);
        });
        setVotes(groupedVotes);
      }
    } catch (error) {
      console.error('Error loading votes:', error);
    }
  };

  // Save votes (useful for batch operations)
  const saveVotes = (newVotes: Record<string, Vote[]>) => {
    setVotes(newVotes);
  };

  return {
    submitVote: handleSubmitVote,
    deleteVote: handleDeleteVote,
    getVotes,
    saveVotes,
    loadVotes,
    votes
  };
}
