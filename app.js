const playerButton = document.getElementById('playerButton');
const bankerButton = document.getElementById('bankerButton');
const winButton = document.getElementById('winButton');
const loseButton = document.getElementById('loseButton');
const recommendedBetElement = document.getElementById('recommendedBet');
const strategyButtons = document.querySelectorAll('.strategy-button');

let history = [];
let lastBet = null;
let lastResult = null;
let selectedStrategy = 'repeatLastBet';

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
strategyButtons.forEach(button => button.addEventListener('click', () => selectStrategy(button.dataset.strategy)));

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

function selectStrategy(strategy) {
    selectedStrategy = strategy;
    updateRecommendation();
}

function updateChart() {
    const ctx = document.getElementById('historyChart').getContext('2d');
    const data = {
        labels: history.map((_, index) => index + 1),
        datasets: [{
            label: 'History',
            data: history.map(hand => hand.bet === 'Player' ? 1 : 2),
            backgroundColor: history.map(hand => hand.bet === 'Player' ? 'blue' : 'red')
        }]
    };

    if (window.chartInstance) {
        window.chartInstance.destroy();
    }

    window.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Hand Number'
                    }
                },
                y: {
                    ticks: {
                        callback: function(value) {
                            return value === 1 ? 'Player' : 'Banker';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Bet'
                    },
                    min: 0,
                    max: 3,
                    stepSize: 1
                }
            }
        }
    });
}

function updateRecommendation() {
    const recommendedBet = strategies[selectedStrategy]();
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
updateRecommendation();
