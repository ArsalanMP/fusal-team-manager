// Vote structure
export const voteModel = {
    id: String,
    playerId: String,
    voterId: String, // Could be user ID or name
    timestamp: Date,
    attributes: {}, // Will contain all player attributes with voted values
    comment: String // Optional comment with the vote
};

// Calculate average stats from votes
export const calculateAverageStats = (votes) => {
    if (!votes || votes.length === 0) return {};

    // Initialize sum object
    const sum = {};
    
    // Sum up all values for each attribute
    votes.forEach(vote => {
        Object.entries(vote.attributes).forEach(([key, value]) => {
            sum[key] = (sum[key] || 0) + value;
        });
    });

    // Calculate average for each attribute
    const averages = {};
    Object.entries(sum).forEach(([key, total]) => {
        averages[key] = Math.round(total / votes.length);
    });

    return averages;
};

// Validate vote values
export const validateVote = (vote) => {
    if (!vote.playerId || !vote.voterId) {
        return false;
    }

    // Check if all attributes are between 0 and 100
    return Object.values(vote.attributes).every(value => 
        Number.isInteger(value) && value >= 0 && value <= 100
    );
}; 