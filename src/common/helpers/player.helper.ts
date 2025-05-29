export function calculateElo(wins: number, losses: number): number {
    const total = wins + losses;
    if (total === 0) return 0.0;
    return parseFloat(((wins / total) * 100).toFixed(1)); // Tỉ lệ thắng %
}

export function calculateRankByWins(wins: number): string {
    if (wins >= 50) return 'Master';
    if (wins >= 35) return 'Diamond';
    if (wins >= 20) return 'Platinum';
    if (wins >= 10) return 'Gold';
    if (wins >= 5) return 'Silver';
    return 'Bronze';
}

export function calculateRankPointByWins(wins: number): number {
    if (wins >= 50) return 100;

    let currentTierMin = 0;
    let nextTierMax = 5;

    if (wins >= 35) {
        currentTierMin = 35;
        nextTierMax = 50;
    } else if (wins >= 20) {
        currentTierMin = 20;
        nextTierMax = 35;
    } else if (wins >= 10) {
        currentTierMin = 10;
        nextTierMax = 20;
    } else if (wins >= 5) {
        currentTierMin = 5;
        nextTierMax = 10;
    } else {
        currentTierMin = 0;
        nextTierMax = 5;
    }

    return Math.floor(((wins - currentTierMin) / (nextTierMax - currentTierMin)) * 100);
}

export function calculateLevel(exp: number): number {
    return Math.floor(Math.sqrt(exp / 100));
}
