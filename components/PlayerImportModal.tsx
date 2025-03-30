"use client";

// Components
import Image from "next/image";

// Hooks
import { useState, useRef, ChangeEvent, FormEvent } from "react";

// Models
import { playerRoles } from "@/models/playerModels";
import { PlayerRole } from "@/models/types";

// Styles
import "./PlayerImportModal.css";

interface PlayerImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlayer: (player: any) => void;
}

interface PlayerFormData {
  name: string;
  position: PlayerRole;
}

function PlayerImportModal({
  isOpen,
  onClose,
  onAddPlayer,
}: PlayerImportModalProps) {
  const [player, setPlayer] = useState<PlayerFormData>({
    name: "",
    position: playerRoles[0],
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newPlayer = {
      id: Date.now(),
      ...player,
      photoUrl: photoPreview,
    };
    onAddPlayer(newPlayer);

    // Reset form
    setPlayer({
      name: "",
      position: playerRoles[0],
    });
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Player</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="player-form">
          <div className="form-group">
            <label>Photo:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              ref={fileInputRef}
            />
            {photoPreview && (
              <Image
                src={photoPreview}
                alt="Preview"
                className="photo-preview"
              />
            )}
          </div>

          <div className="form-group">
            <label>Name:</label>
            <input
              required
              type="text"
              value={player.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPlayer({ ...player, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Position:</label>
            <select
              value={player.position}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setPlayer({ ...player, position: e.target.value as PlayerRole })
              }
            >
              {playerRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-button">
            Add Player
          </button>
        </form>
      </div>
    </div>
  );
}

export default PlayerImportModal;
