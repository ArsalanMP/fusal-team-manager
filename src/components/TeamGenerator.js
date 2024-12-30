import React, { useState } from 'react';
import { calculateOverallScore } from '../models/playerModel';
import PlayerListView from './PlayerListView';
import './TeamGenerator.css';

function TeamGenerator({ players }) {
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [generatedTeams, setGeneratedTeams] = useState(null);

  const generateTeams = () => {
    // Calculate overall scores for all players
    const playersWithScores = players.map(player => ({
      ...player,
      overallScore: parseFloat(calculateOverallScore(player, player.position))
    }));

    // Group players by position
    const playersByPosition = playersWithScores.reduce((acc, player) => {
      if (!acc[player.position]) {
        acc[player.position] = [];
      }
      acc[player.position].push(player);
      return acc;
    }, {});

    // Sort players in each position by overall score
    Object.keys(playersByPosition).forEach(position => {
      playersByPosition[position].sort((a, b) => b.overallScore - a.overallScore);
    });

    // Initialize teams
    const teams = Array.from({ length: numberOfTeams }, () => ({
      players: [],
      totalScore: 0
    }));

    // Try to distribute goalkeepers first if available
    if (playersByPosition['Goleiro']) {
      playersByPosition['Goleiro'].forEach((player, index) => {
        const teamIndex = index % numberOfTeams;
        teams[teamIndex].players.push(player);
        teams[teamIndex].totalScore += player.overallScore;
      });
    }

    // Collect remaining players
    const remainingPlayers = Object.values(playersByPosition)
      .flat()
      .filter(player => player.position !== 'Goleiro')
      .sort((a, b) => b.overallScore - a.overallScore);

    // Distribute remaining players using snake draft for balance
    remainingPlayers.forEach((player) => {
      // Find team with lowest total score
      const targetTeamIndex = teams
        .map((team, index) => ({ index, score: team.totalScore }))
        .sort((a, b) => a.score - b.score)[0].index;

      teams[targetTeamIndex].players.push(player);
      teams[targetTeamIndex].totalScore += player.overallScore;
    });

    setGeneratedTeams(teams);
  };

  const maxTeams = Math.floor(players.length / 2);
  const isValidTeamCount = numberOfTeams >= 2 && numberOfTeams <= maxTeams;

  return (
    <div className="team-generator">
      <div className="generator-controls">
        <label>
          Number of Teams:
          <input
            type="number"
            min="2"
            max={maxTeams}
            value={numberOfTeams}
            onChange={(e) => setNumberOfTeams(parseInt(e.target.value))}
          />
        </label>
        <button 
          onClick={generateTeams} 
          disabled={!isValidTeamCount}
          className="generate-button"
        >
          {isValidTeamCount ? 'Generate Teams' : `Need at least ${numberOfTeams * 2} players`}
        </button>
      </div>

      {generatedTeams && (
        <div className="teams-display">
          {generatedTeams.map((team, index) => (
            <div key={index} className="team-card">
              <div className="team-header">
                <h3 className="team-title">Team {index + 1}</h3>
                <div className="team-stats">
                  Rating: {(team.totalScore / team.players.length).toFixed(1)}
                </div>
              </div>
              <PlayerListView players={team.players} variant="simple" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeamGenerator; 