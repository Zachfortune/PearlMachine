const playerButton = document.getElementById('playerButton');
const bankerButton = document.getElementById('bankerButton');
const winButton = document.getElementById('winButton');
const loseButton = document.getElementById('loseButton');
const recommendedBetElement = document.getElementById('recommendedBet');

let history = [];
let lastBet = null;
let lastResult = null;

// Strategies
const strategies = {
    repeatLastBet: () => lastBet,
    alternateBet: () => (lastBet === 'Player' ? 'Banker' : 'Player'),
    followTrend: () => followTrend(),
    reverseTrend: () => reverseTrend(),
    zachsSecretSauce1: () => zachsSecretSauce1(),
    zachsSecretSauce2: () => zachsSecretSauce2(),
};

let sequence = 'BPBPPBBP';
let zachsSecretSauce1Index = 0;

// Handle buttons click
playerButton.addEventListener('click', () => setBet('Player'));
bankerButton.addEventListener('click', () => setBet('Banker'));
winButton.addEventListener('click', () => setResult('Win'));
loseButton.addEventListener('click', () => setResult('Lose'));

function setBet(bet) {
    lastBet = bet;
    winButton.disabled = false;
    loseButton.disabled = false;
}

function setResult(result) {
    if (!lastBet) return;
    lastResult = result;
    history.push({ bet: lastBet, result: lastResult });
    updateChart();
    updateRecommendation();
    winButton.disabled = true;
    loseButton.disabled = true;
}

function updateChart() {
    // Update the chart with the latest history (Implement using Chart.js or similar library)
}

function updateRecommendation() {
    const strategyName = 'followTrend'; // Change this to test different strategies
    const recommendedBet = strategies[strategyName]();
    recommendedBetElement.textContent = recommendedBet;
}

function followTrend() {
    const lastFour = history.slice(-4);
    const playerWins = lastFour.filter(hand => hand.bet === 'Player' && hand.result === 'Win').length;
    const bankerWins = lastFour.filter(hand => hand.bet === 'Banker' && hand.result === 'Win').length;
    return playerWins > bankerWins ? 'Player' : 'Banker';
}

function reverseTrend() {
    const lastFour = history.slice(-4);
    const playerWins = lastFour.filter(hand => hand.bet === 'Player' && hand.result === 'Win').length;
    const bankerWins = lastFour.filter(hand => hand.bet === 'Banker' && hand.result === 'Win').length;
    return playerWins > bankerWins ? 'Banker' : 'Player';
}

function zachsSecretSauce1() {
    const nextBet = sequence[zachsSecretSauce1Index % sequence.length] === 'P' ? 'Banker' : 'Player';
    if (lastResult === 'Win') {
        zachsSecretSauce1Index = 0;
    } else {
        zachsSecretSauce1Index++;
    }
    return nextBet;
}

function zachsSecretSauce2() {
    const lastFour = history.slice(-4);
    const lastFourPlayers = lastFour.filter(hand => hand.bet === 'Player').length;
    const lastFourBankers = lastFour.filter(hand => hand.bet === 'Banker').length;
    if (lastFourPlayers === 4 || lastFourBankers === 4) {
        return lastFourPlayers === 4 ? 'Banker' : 'Player';
    }
    return followTrend();
}

// Initialize chart
updateChart();
