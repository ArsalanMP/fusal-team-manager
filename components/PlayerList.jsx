import React, { useState } from "react";
import {
  playerAttributes,
  playerRoles,
  calculateOverallScore,
} from "@/models/playerModels";
import "./PlayerList.css";

const PlayerList = ({ players, onUpdatePlayer, onDeletePlayer }) => {
  const [viewingStats, setViewingStats] = useState(null);

  const handleViewStats = (player) => {
    setViewingStats({ ...player });
  };

  const handleCloseStats = () => {
    setViewingStats(null);
  };

  const getPositionColor = (position) => {
    const colors = {
      Pivot: "#ff6b6b",
      Ala: "#4dabf7",
      Fixo: "#51cf66",
      Universal: "#845ef7",
      Goleiro: "#ffd43b",
    };
    return colors[position] || "#868e96";
  };

  const getStatsPoints = (player) => {
    // Use all player attributes
    const displayStats = Object.entries(playerAttributes).map(
      ([key, { label }]) => ({
        label,
        value: Math.round(player[key] || 0),
      })
    );

    // Calculate points for hexagonal chart
    return displayStats.map((stat, i) => {
      const angle = (Math.PI * 2 * i) / displayStats.length;
      const value = stat.value / 100; // Normalize to 0-1
      return {
        x: Math.cos(angle) * value,
        y: Math.sin(angle) * value,
        label: stat.label,
        value: stat.value,
      };
    });
  };

  const renderStatsChart = (player, showLabels = false) => {
    const points = getStatsPoints(player);
    // Adjust size to be smaller overall
    const size = showLabels ? 280 : 200; // Smaller sizes for both views
    const center = size / 2;
    const padding = showLabels ? 60 : 40; // Smaller padding
    const chartSize = size - padding * 2;

    // Create the points string for the polygon
    const polygonPoints = points
      .map(({ x, y }) => {
        const px = center + x * chartSize;
        const py = center + y * chartSize;
        return `${px},${py}`;
      })
      .join(" ");

    // Create background grid lines
    const gridLevels = 4;
    const gridPolygons = [...Array(gridLevels)].map((_, i) => {
      const value = (i + 1) / gridLevels;
      return points
        .map(({ x, y }) => {
          const px = center + x * chartSize * value;
          const py = center + y * chartSize * value;
          return `${px},${py}`;
        })
        .join(" ");
    });

    // Calculate grid line positions and labels
    const gridLines = points.map((point, i) => {
      const angle = (Math.PI * 2 * i) / points.length;
      const gridEndX = center + Math.cos(angle) * chartSize;
      const gridEndY = center + Math.sin(angle) * chartSize;
      const labelX = center + Math.cos(angle) * (chartSize + 20);
      const labelY = center + Math.sin(angle) * (chartSize + 20);
      return { gridEndX, gridEndY, labelX, labelY };
    });

    return (
      <div className="stats-chart">
        <svg
          width={size}
          height={size}
          viewBox={`-${size / 4} -${size / 4} ${size * 1.5} ${size * 1.5}`}
        >
          {/* Background grid */}
          <g className="grid-lines">
            {/* Radial grid lines */}
            {gridLines.map((pos, i) => (
              <g key={`line-${i}`}>
                <line
                  x1={center}
                  y1={center}
                  x2={pos.gridEndX}
                  y2={pos.gridEndY}
                  stroke="#2c3e50"
                  strokeWidth="1.5"
                />
                {showLabels && (
                  <text
                    x={pos.labelX}
                    y={pos.labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="11"
                    fontWeight="500"
                  >
                    {points[i].label}
                  </text>
                )}
              </g>
            ))}

            {/* Circular grid lines */}
            {gridPolygons.map((points, i) => (
              <polygon
                key={`grid-${i}`}
                points={points}
                fill="none"
                stroke="#2c3e50"
                strokeWidth="1.5"
              />
            ))}

            {/* Value indicators */}
            {showLabels && gridLevels > 0 && (
              <text
                x={center + 5}
                y={center - chartSize / gridLevels - 5}
                fill="white"
                fontSize="9"
                opacity="0.8"
              >
                25
              </text>
            )}
            {showLabels && gridLevels > 1 && (
              <text
                x={center + 5}
                y={center - (2 * chartSize) / gridLevels - 5}
                fill="white"
                fontSize="9"
                opacity="0.8"
              >
                50
              </text>
            )}
            {showLabels && gridLevels > 2 && (
              <text
                x={center + 5}
                y={center - (3 * chartSize) / gridLevels - 5}
                fill="white"
                fontSize="9"
                opacity="0.8"
              >
                75
              </text>
            )}
            {showLabels && gridLevels > 3 && (
              <text
                x={center + 5}
                y={center - (4 * chartSize) / gridLevels - 5}
                fill="white"
                fontSize="9"
                opacity="0.8"
              >
                100
              </text>
            )}
          </g>

          {/* Stats polygon with gradient */}
          <defs>
            <linearGradient
              id="statsGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3498db" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2ecc71" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <g className="stats-polygon">
            <polygon
              points={polygonPoints}
              fill="url(#statsGradient)"
              stroke="#3498db"
              strokeWidth="2"
            />
          </g>
        </svg>
      </div>
    );
  };

  return (
    <div className="player-list">
      {players.length === 0 ? (
        <div className="empty-players-container">
          <div className="empty-players-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <h3>No players added yet</h3>
            <p>Add your first player to get started!</p>
          </div>
        </div>
      ) : (
        players.map((player) => {
          const overallScore = calculateOverallScore(player, player.position);
          const positionColor = getPositionColor(player.position);

          return (
            <div key={player.id} className="player-card">
              <div className="player-content">
                <div className="player-header">
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
                  <div className="player-info">
                    <h3 className="player-name">{player.name}</h3>
                    <div className="player-meta">
                      <span
                        className="position"
                        style={{ background: positionColor }}
                      >
                        {player.position}
                      </span>
                      <span className="overall-score">{overallScore}</span>
                    </div>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => onDeletePlayer(player.id)}
                  >
                    ×
                  </button>
                </div>

                <div className="player-stats">
                  <div className="overall-label">
                    <span>Overall Rating</span>
                    <span>{overallScore}</span>
                  </div>
                  <div className="overall-progress">
                    <div
                      className="overall-progress-fill"
                      style={{ width: `${overallScore}%` }}
                    />
                  </div>
                  <div className="stats-chart">{renderStatsChart(player)}</div>
                </div>

                <button
                  className="edit-button"
                  onClick={() => handleViewStats(player)}
                >
                  View Stats
                </button>
              </div>
            </div>
          );
        })
      )}

      {/* Stats Modal */}
      {viewingStats && (
        <div className="stats-modal-overlay" onClick={handleCloseStats}>
          <div
            className="stats-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="stats-modal-header">
              <h2>{viewingStats.name}'s Stats</h2>
              <button className="close-button" onClick={handleCloseStats}>
                ×
              </button>
            </div>
            <div className="stats-modal-body">
              {renderStatsChart(viewingStats, true)}
              <div className="stats-details">
                {Object.entries(playerAttributes).map(([key, { label }]) => (
                  <div key={key} className="stat-detail-item">
                    <span className="stat-label">{label}</span>
                    <div className="stat-bar">
                      <div
                        className="stat-bar-fill"
                        style={{ width: `${viewingStats[key] || 0}%` }}
                      />
                    </div>
                    <span className="stat-value">{viewingStats[key] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerList;
