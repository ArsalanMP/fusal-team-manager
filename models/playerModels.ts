import { Player as PlayerInterface, PlayerAttribute, PlayerAttributes, PlayerRole, PositionWeightsMap } from './types';

// Player attributes and their weights for overall score calculation
export const playerAttributes: PlayerAttributes = {
  speed: { label: "Speed", weight: 0.15 },
  shotPower: { label: "Shot Power", weight: 0.15 },
  shotAccuracy: { label: "Shot Accuracy", weight: 0.15 },
  physics: { label: "Physics", weight: 0.1 },
  goalkeeping: { label: "Goalkeeping", weight: 0.1 },
  dribbling: { label: "Dribbling", weight: 0.1 },
  passing: { label: "Passing", weight: 0.1 },
  defense: { label: "Defense", weight: 0.1 },
  stamina: { label: "Stamina", weight: 0.05 },
  teamPlay: { label: "Team Play", weight: 0.1 },
  positioning: { label: "Positioning", weight: 0.1 },
  reliability: { label: "Reliability", weight: 0.1 },
};

// Updated for futsal positions
export const playerRoles: PlayerRole[] = [
  "Pivot", // Main striker/target player
  "Ala", // Wing player
  "Fixo", // Defensive specialist
  "Universal", // All-around player
  "Goleiro", // Goalkeeper
];

export const calculateOverallScore = (player: PlayerInterface, position?: PlayerRole): string => {
  // Position-specific attribute weights
  const positionWeights: PositionWeightsMap = {
    Pivot: {
      shotPower: 0.25,
      shotAccuracy: 0.25,
      physics: 0.15,
      teamPlay: 0.15,
      positioning: 0.2,
    },
    Ala: {
      speed: 0.25,
      dribbling: 0.2,
      passing: 0.15,
      stamina: 0.15,
      positioning: 0.15,
      reliability: 0.1,
    },
    Fixo: {
      defense: 0.3,
      passing: 0.2,
      physics: 0.15,
      teamPlay: 0.15,
      positioning: 0.2,
      reliability: 0.15,
    },
    Universal: {
      teamPlay: 0.2,
      passing: 0.15,
      dribbling: 0.15,
      stamina: 0.15,
      defense: 0.15,
      positioning: 0.1,
      reliability: 0.1,
    },
    Goleiro: {
      goalkeeping: 0.4,
      physics: 0.2,
      passing: 0.15,
      teamPlay: 0.1,
      positioning: 0.15,
      reliability: 0.15,
    },
  };

  let total = 0;
  let weightSum = 0;

  Object.entries(playerAttributes).forEach(([key, { weight }]) => {
    const roleWeight = (position && positionWeights[position]?.[key]) || weight;
    total += (player[key] || 0) * roleWeight;
    weightSum += roleWeight;
  });

  return (total / weightSum || 0).toFixed(1);
};

class Player implements PlayerInterface {
  id: string;
  name: string;
  position: PlayerRole;
  photoUrl: string | null;
  lastModified: Date;
  speed: number;
  shotPower: number;
  shotAccuracy: number;
  physics: number;
  goalkeeping: number;
  dribbling: number;
  passing: number;
  defense: number;
  stamina: number;
  teamPlay: number;
  positioning: number;
  reliability: number;
  [key: string]: any;

  constructor(id: string, name: string, position: PlayerRole) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.photoUrl = null;
    this.lastModified = new Date();

    // Initialize all attributes to 0
    this.speed = 0;
    this.shotPower = 0;
    this.shotAccuracy = 0;
    this.physics = 0;
    this.goalkeeping = 0;
    this.dribbling = 0;
    this.passing = 0;
    this.defense = 0;
    this.stamina = 0;
    this.teamPlay = 0;
    this.positioning = 0;
    this.reliability = 0;

    // Initialize any additional attributes
    Object.keys(playerAttributes).forEach((attr) => {
      if (!(attr in this)) {
        this[attr] = 0;
      }
    });
  }
}

export default Player;
