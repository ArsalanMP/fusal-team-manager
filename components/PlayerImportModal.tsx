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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let photoUrl = null;

      // Upload image if selected
      if (selectedFile) {
        console.log('Uploading file:', selectedFile.name, selectedFile.size, selectedFile.type);
        
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          console.log('Upload response status:', response.status);

          if (response.ok) {
            const result = await response.json();
            console.log('Upload successful:', result);
            photoUrl = result.url;
          } else {
            const error = await response.json();
            console.error('Upload failed:', error);
            alert(`Upload failed: ${error.error}`);
            setIsUploading(false);
            return;
          }
        } catch (fetchError) {
          console.error('Fetch error:', fetchError);
          alert('Network error during upload. Please try again.');
          setIsUploading(false);
          return;
        }
      }

      const newPlayer = {
        id: Date.now().toString(),
        ...player,
        photoUrl,
      };
      
      await onAddPlayer(newPlayer);

      // Reset form
      setPlayer({
        name: "",
        position: playerRoles[0],
      });
      setPhotoPreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    } catch (error) {
      console.error('Error submitting player:', error);
      alert('Failed to add player. Please try again.');
    } finally {
      setIsUploading(false);
    }
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
              <img
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

          <button 
            type="submit" 
            className="submit-button"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Add Player'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PlayerImportModal;
