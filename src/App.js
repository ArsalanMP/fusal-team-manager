import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PlayerImportModal from './components/PlayerImportModal';
import PlayerList from './components/PlayerList';
import TeamGenerator from './components/TeamGenerator';
import VotingPage from './pages/VotingPage';
import Logo from './components/Logo';
import './App.css';

function App() {
    // Load players from localStorage
    const [players, setPlayers] = useState(() => {
        const savedPlayers = localStorage.getItem('futsalPlayers');
        return savedPlayers ? JSON.parse(savedPlayers) : [];
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Save players to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('futsalPlayers', JSON.stringify(players));
    }, [players]);

    const handleAddPlayer = (newPlayer) => {
        setPlayers([...players, newPlayer]);
    };

    const handleUpdatePlayer = (updatedPlayer) => {
        setPlayers(players.map(player => 
            player.id === updatedPlayer.id ? updatedPlayer : player
        ));
    };

    const handleDeletePlayer = (playerId) => {
        setPlayers(players.filter(player => player.id !== playerId));
    };

    const handleSubmitVote = (vote) => {
        // Here you would typically save the vote to your backend
        console.log('Vote submitted:', vote);
    };

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <Link to="/" className="app-title">
                        <Logo size={32} />
                        <span>Futsal Team Manager</span>
                    </Link>
                    <div className="header-actions">
                        <Link to="/" className="nav-link">Players</Link>
                        <Link to="/vote" className="nav-link">Vote</Link>
                        <Link to="/team-generator" className="nav-link">Team Generator</Link>
                        <button 
                            className="nav-link add-button"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add Player
                        </button>
                    </div>
                </header>

                <main className="App-main">
                    <PlayerImportModal 
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onAddPlayer={handleAddPlayer}
                    />
                    
                    <Routes>
                        <Route path="/" element={
                            <PlayerList 
                                players={players}
                                onUpdatePlayer={handleUpdatePlayer}
                                onDeletePlayer={handleDeletePlayer}
                            />
                        } />
                        <Route path="/vote" element={
                            <VotingPage 
                                players={players}
                                onSubmitVote={handleSubmitVote}
                                onUpdatePlayer={handleUpdatePlayer}
                            />
                        } />
                        <Route path="/team-generator" element={
                            <TeamGenerator players={players} />
                        } />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App; 