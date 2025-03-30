"use client";
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Player, Vote } from "../models/types";

// Create a persistent atom for players
const playersAtom = atomWithStorage<Player[]>("futsalPlayers", []);

// Create a persistent atom for modal state
const modalOpenAtom = atom<boolean>(false);

// Create a persistent atom for votes
const votesAtom = atomWithStorage<Record<string, Vote[]>>("futsalVotes", {});

export function usePlayers() {
  const [players, setPlayers] = useAtom(playersAtom);

  const handleAddPlayer = (newPlayer: Player) => {
    setPlayers([...players, newPlayer]);
  };

  const handleUpdatePlayer = (updatedPlayer: Player) => {
    setPlayers(
      players.map((player) =>
        player.id === updatedPlayer.id ? updatedPlayer : player
      )
    );
  };

  const handleDeletePlayer = (playerId: string) => {
    setPlayers(players.filter((player) => player.id !== playerId));
  };

  return {
    players,
    addPlayer: handleAddPlayer,
    updatePlayer: handleUpdatePlayer,
    deletePlayer: handleDeletePlayer,
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

  const handleSubmitVote = (vote: Partial<Vote> & { id?: string }) => {
    // Save the vote to our atom storage
    const updatedVotes = { ...votes };
    
    // Add or update vote based on some identifier (like eventId or date)
    if (vote.id) {
      const voteId = vote.id;
      if (!updatedVotes[voteId]) {
        updatedVotes[voteId] = [];
      }
      updatedVotes[voteId].push(vote as Vote);
    } else if (vote.playerId) {
      // If no id provided, use playerId instead
      const playerId = vote.playerId;
      if (!updatedVotes[playerId]) {
        updatedVotes[playerId] = [];
      }
      updatedVotes[playerId].push(vote as Vote);
    } else {
      // Fallback to timestamp if no id
      const id = `vote-${Date.now()}`;
      if (!updatedVotes[id]) {
        updatedVotes[id] = [];
      }
      updatedVotes[id].push({ ...vote, id } as Vote);
    }
    
    setVotes(updatedVotes);
    console.log("Vote submitted:", vote);
  };

  // Get all votes or specific vote by id
  const getVotes = (id: string | null = null): Record<string, Vote[]> | Vote[] | null => {
    if (id) {
      return votes[id] || null;
    }
    return votes;
  };

  // Save votes (useful for batch operations)
  const saveVotes = (newVotes: Record<string, Vote[]>) => {
    setVotes(newVotes);
  };

  return {
    submitVote: handleSubmitVote,
    getVotes,
    saveVotes,
    votes
  };
}
