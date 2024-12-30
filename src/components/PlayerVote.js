import React, { useState } from 'react';
import { playerAttributes } from '../models/playerModel';
import './PlayerVote.css';

const PlayerVote = ({ player, onSubmitVote }) => {
    const initialAttributes = Object.keys(playerAttributes).reduce((acc, key) => {
        // Start with current player values if they exist, otherwise use 50
        acc[key] = player[key] || 50;
        return acc;
    }, {});

    const [attributes, setAttributes] = useState(initialAttributes);
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const voteToSubmit = {
            playerId: player.id,
            attributes,
            comment,
            timestamp: new Date()
        };

        onSubmitVote(voteToSubmit);
    };

    const handleAttributeChange = (key, value) => {
        setAttributes(prev => ({
            ...prev,
            [key]: parseInt(value)
        }));
    };

    return (
      <form onSubmit={handleSubmit} className="player-vote">
        <div className="stats-grid">
          {Object.entries(playerAttributes).map(([key, { label }]) => (
            <div key={key} className="stat-item">
              <label>{label}</label>
              <div className="stat-input-group">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={attributes[key]}
                  onChange={(e) => handleAttributeChange(key, e.target.value)}
                />
              </div>
              <span className="stat-value">{attributes[key]}</span>
            </div>
          ))}
        </div>

        <div className="form-group">
          <label>Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional: Add a comment about your rating"
          />
        </div>

        <div className="button-group">
          <button type="submit" className="submit-vote">
            Submit Vote
          </button>
        </div>
      </form>
    );
};

export default PlayerVote; 