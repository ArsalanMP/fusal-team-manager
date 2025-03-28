"use client";
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Create a persistent atom for players
const playersAtom = atomWithStorage("futsalPlayers", []);

// Create a persistent atom for modal state
const modalOpenAtom = atom(false);

// Create a persistent atom for votes
const votesAtom = atomWithStorage("futsalVotes", {});

export function usePlayers() {
  const [players, setPlayers] = useAtom(playersAtom);

  const handleAddPlayer = (newPlayer) => {
    setPlayers([...players, newPlayer]);
  };

  const handleUpdatePlayer = (updatedPlayer) => {
    setPlayers(
      players.map((player) =>
        player.id === updatedPlayer.id ? updatedPlayer : player
      )
    );
  };

  const handleDeletePlayer = (playerId) => {
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

  const handleSubmitVote = (vote) => {
    // Save the vote to our atom storage
    const updatedVotes = { ...votes };
    
    // Add or update vote based on some identifier (like eventId or date)
    if (vote.id) {
      updatedVotes[vote.id] = vote;
    } else {
      // If no id provided, use timestamp as fallback
      const id = `vote-${Date.now()}`;
      updatedVotes[id] = { ...vote, id };
    }
    
    setVotes(updatedVotes);
    console.log("Vote submitted:", vote);
  };

  // Get all votes or specific vote by id
  const getVotes = (id = null) => {
    if (id) {
      return votes[id] || null;
    }
    return votes;
  };

  // Save votes (useful for batch operations)
  const saveVotes = (newVotes) => {
    setVotes(newVotes);
  };

  return {
    submitVote: handleSubmitVote,
    getVotes,
    saveVotes,
    votes
  };
}
