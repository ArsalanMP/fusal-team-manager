import React, { useState, useRef } from 'react';
import { playerRoles } from '../models/playerModel';
import './PlayerImportModal.css';

function PlayerImportModal({ isOpen, onClose, onAddPlayer }) {
    const [player, setPlayer] = useState({
        name: '',
        position: playerRoles[0]
    });
    const [photoPreview, setPhotoPreview] = useState(null);
    const fileInputRef = useRef();

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPlayer = {
            id: Date.now(),
            ...player,
            photoUrl: photoPreview
        };
        onAddPlayer(newPlayer);
        
        // Reset form
        setPlayer({
            name: '',
            position: playerRoles[0]
        });
        setPhotoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Player</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
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
                            onChange={(e) => setPlayer({...player, name: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label>Position:</label>
                        <select
                            value={player.position}
                            onChange={(e) => setPlayer({...player, position: e.target.value})}
                        >
                            {playerRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
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