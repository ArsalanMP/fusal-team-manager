// Player types
export interface PlayerAttribute {
  label: string;
  weight: number;
}

export interface PlayerAttributes {
  [key: string]: PlayerAttribute;
}

export interface PositionWeights {
  [key: string]: number;
}

export interface PositionWeightsMap {
  [position: string]: {
    [attribute: string]: number;
  };
}

export type PlayerRole = "Pivot" | "Ala" | "Fixo" | "Universal" | "Goleiro";

export interface Player {
  id: string;
  name: string;
  position: PlayerRole;
  photoUrl: string | null;
  lastModified: Date;
  speed?: number;
  shotPower?: number;
  shotAccuracy?: number;
  physics?: number;
  goalkeeping?: number;
  dribbling?: number;
  passing?: number;
  defense?: number;
  stamina?: number;
  teamPlay?: number;
  positioning?: number;
  reliability?: number;
  [key: string]: any; // For dynamic attributes
}

// Vote types
export interface VoteAttributes {
  [key: string]: number;
}

export interface Vote {
  id: string;
  playerId: string;
  voterId: string;
  timestamp: Date;
  attributes: VoteAttributes;
  comment?: string;
}
