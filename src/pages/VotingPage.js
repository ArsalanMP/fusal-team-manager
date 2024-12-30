import React, { useState } from 'react';
import PlayerVote from '../components/PlayerVote';
import { calculateAverageStats } from '../models/voteModel';
import './VotingPage.css';

const VotingPage = ({ players, onSubmitVote }) => {
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [currentVoter, setCurrentVoter] = useState(null);
    const [votes, setVotes] = useState({}); // This should be loaded from your backend

    // If no voter is selected, show the voter selection screen
    if (!currentVoter) {
        return (
            <div className="voting-page">
                <div className="voter-selection">
                    <h2>Select Your Player</h2>
                    <div className="player-grid">
                        {players.map(player => (
                            <div 
                                key={player.id} 
                                className="player-vote-card"
                                onClick={() => setCurrentVoter(player)}
                            >
                                <div className="player-info">
                                    <div className="player-photo-container">
                                        {player.photoUrl ? (
                                            <img 
                                                src={player.photoUrl} 
                                                alt={player.name} 
                                                className="player-photo"
                                            />
                                        ) : (
                                            <div className="player-photo-placeholder">
                                                {player.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="player-details">
                                        <h3>{player.name}</h3>
                                        <span className="position">{player.position}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // If a voter is selected but no player is selected to vote on
    if (!selectedPlayer) {
        return (
            <div className="voting-page">
                <div className="voter-selection">
                    <h2>Vote for Players</h2>
                    <h3 className="current-voter">Voting as: {currentVoter.name}</h3>
                    <div className="player-grid">
                        {players.filter(p => p.id !== currentVoter.id).map(player => (
                            <div 
                                key={player.id} 
                                className="player-vote-card"
                                onClick={() => setSelectedPlayer(player)}
                            >
                                <div className="player-info">
                                    <div className="player-photo-container">
                                        {player.photoUrl ? (
                                            <img 
                                                src={player.photoUrl} 
                                                alt={player.name} 
                                                className="player-photo"
                                            />
                                        ) : (
                                            <div className="player-photo-placeholder">
                                                {player.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="player-details">
                                        <h3>{player.name}</h3>
                                        <span className="position">{player.position}</span>
                                    </div>
                                </div>
                                {votes[player.id]?.length > 0 && (
                                    <div className="vote-stats">
                                        <span>{votes[player.id].length} votes</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Show the voting form for the selected player
    return (
        <div className="voting-page">
            <div className="voter-selection">
                <h2>Rate Player: {selectedPlayer.name}</h2>
                <PlayerVote 
                    player={selectedPlayer}
                    onSubmitVote={(vote) => {
                        // Add the voter information to the vote
                        const voteWithVoter = {
                            ...vote,
                            voterId: currentVoter.id,
                            voterName: currentVoter.name
                        };
                        onSubmitVote(voteWithVoter);
                        
                        // Update local votes state
                        setVotes(prev => ({
                            ...prev,
                            [selectedPlayer.id]: [
                                ...(prev[selectedPlayer.id] || []),
                                voteWithVoter
                            ]
                        }));
                        
                        // Reset selected player
                        setSelectedPlayer(null);
                    }}
                />
            </div>
        </div>
    );
};

export default VotingPage; 