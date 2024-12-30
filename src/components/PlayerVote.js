import React, { useState } from 'react';
import { playerAttributes } from '../models/playerModel';
import { validateVote } from '../models/voteModel';
import './PlayerVote.css';

const PlayerVote = ({ player, onSubmitVote }) => {
    const [vote, setVote] = useState({
        playerId: player.id,
        voterId: '', // This should be set to the current user's ID
        attributes: Object.keys(playerAttributes).reduce((acc, key) => {
            acc[key] = 50; // Default value
            return acc;
        }, {}),
        comment: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateVote(vote)) {
            onSubmitVote({
                ...vote,
                timestamp: new Date()
            });
        }
    };

    return (
        <div className="player-vote">
            <div className="vote-header">
                <h2>Rate Player: {player.name}</h2>
                <div className="player-info">
                    <span className="position">{player.position}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="vote-form">
                <div className="stats-grid">
                    {Object.entries(playerAttributes).map(([key, { label }]) => (
                        <div key={key} className="stat-item">
                            <label>{label}:</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={vote.attributes[key]}
                                onChange={(e) => setVote({
                                    ...vote,
                                    attributes: {
                                        ...vote.attributes,
                                        [key]: parseInt(e.target.value)
                                    }
                                })}
                            />
                            <span>{vote.attributes[key]}</span>
                        </div>
                    ))}
                </div>

                <div className="form-group">
                    <label>Comment (optional):</label>
                    <textarea
                        value={vote.comment}
                        onChange={(e) => setVote({
                            ...vote,
                            comment: e.target.value
                        })}
                        placeholder="Add a comment about your rating..."
                    />
                </div>

                <div className="button-group">
                    <button type="submit" className="submit-vote">
                        Submit Vote
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PlayerVote; 