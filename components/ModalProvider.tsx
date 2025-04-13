"use client";

// Hooks
import { usePlayerModal, usePlayers } from "@/utils/logic";

// Components
import PlayerImportModal from "@/components/PlayerImportModal";

const ModalProvider = () => {
  const { isModalOpen, closeModal } = usePlayerModal();
  const { addPlayer } = usePlayers();
  return (
    <PlayerImportModal
      isOpen={isModalOpen}
      onClose={closeModal}
      onAddPlayer={addPlayer}
    />
  );
};

export default ModalProvider;
