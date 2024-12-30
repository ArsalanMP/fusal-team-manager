// Local storage keys
const STORAGE_KEYS = {
    VOTES: 'futsal_votes',
    PLAYERS: 'futsal_players'
};

// Save votes to local storage
export const saveVotes = (votes) => {
    try {
        localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
    } catch (error) {
        console.error('Error saving votes to local storage:', error);
    }
};

// Get votes from local storage
export const getVotes = () => {
    try {
        const votes = localStorage.getItem(STORAGE_KEYS.VOTES);
        return votes ? JSON.parse(votes) : {};
    } catch (error) {
        console.error('Error getting votes from local storage:', error);
        return {};
    }
};

// Save players to local storage
export const savePlayers = (players) => {
    try {
        localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    } catch (error) {
        console.error('Error saving players to local storage:', error);
    }
};

// Get players from local storage
export const getPlayers = () => {
    try {
        const players = localStorage.getItem(STORAGE_KEYS.PLAYERS);
        return players ? JSON.parse(players) : [];
    } catch (error) {
        console.error('Error getting players from local storage:', error);
        return [];
    }
}; 