// Player attributes and their weights for overall score calculation
export const playerAttributes = {
  speed: { label: 'Speed', weight: 0.2 },
  shotPower: { label: 'Shot Power', weight: 0.2 },
  dribbling: { label: 'Dribbling', weight: 0.15 },
  passing: { label: 'Passing', weight: 0.15 },
  defense: { label: 'Defense', weight: 0.15 },
  stamina: { label: 'Stamina', weight: 0.15 }
};

export const calculateOverallScore = (attributes) => {
  return Object.entries(attributes).reduce((total, [key, value]) => {
    return total + (value * (playerAttributes[key]?.weight || 0));
  }, 0).toFixed(1);
}; 