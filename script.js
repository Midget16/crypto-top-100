const apiKey = 'YOUR_CRYPTOCOMPARE_API_KEY';  // Replace with your API key

// Map cryptocurrency symbols to their respective API endpoints
const cryptoSymbols = {
    'bitcoin': 'BTC',
    'solana': 'SOL',
    'dogecoin': 'DOGE',
    'pepe': 'PEPE',
    'xrp': 'XRP',
    'ethereum': 'ETH',
};

let selectedCrypto = 'bitcoin';
let startDate = '2020-12-01';
let endDate = '2021-03-31';

// Fetching data from CryptoCompare
const fetchData = async (crypto, start, end) => {
    const startTs = new Date(start).getTime() / 1000;
    const endTs = new Date(end).getTime() / 1000;

    const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${cryptoSymbols[crypto]}&tsym=USD&toTs=${endTs}&limit=2000`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Apikey ${apiKey}`,
            }
        });

        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        return data.Data.Data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

// Prepare chart data
const prepareChartData = (data) => {
    const labels = data.map(item => new Date(item.time * 1000).toLocaleDateString());
    const prices = data.map(item => item.close);
    const volumes = data.map(item => item.volumefrom);
    const percentChanges = data.map((item, index, arr) => {
        if (index === 0) return 0;
        return ((item.close - arr[index - 1].close) / arr[index - 1].close) * 100;
    });

    return { labels, prices, volumes, percentChanges };
};

// Update charts
const updateCharts = (data) => {
    const { labels, prices, volumes, percentChanges } = prepareChartData(data);

    const priceChart = new Chart(document.getElementById('price-chart').getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Price (USD)',
                data: prices,
                borderColor: '#4CAF50',
                fill: false,
                tension: 0.1,
            }]
        }
    });

    const volumeChart = new Chart(document.getElementById('volume-chart').getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Volume',
                data: volumes,
                backgroundColor: '#FF9800',
                borderColor: '#FF9800',
                borderWidth: 1,
            }]
        }
    });

    const percentChangeChart = new Chart(document.getElementById('percent-change-chart').getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Percent Change',
                data: percentChanges,
                borderColor: '#2196F3',
                fill: false,
                tension: 0.1,
            }]
        }
    });
};

// Update stats section
const updateStats = (crypto) => {
    // Fetch stats like market cap, total supply, etc. from a relevant API (e.g., CoinGecko, CoinMarketCap)
    // Example using CoinGecko (replace with actual implementation):
    const url = `https://api.coingecko.com/api/v3/coins/${cryptoSymbols[crypto]}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('market-cap').textContent = `$${data.market_data.market_cap.usd.toLocaleString()}`;
            document.getElementById('total-supply').textContent = data.market_data.total_supply.toLocaleString();
            document.getElementById('volume').textContent = `$${data.market_data.total_volume.usd.toLocaleString()}`;
        })
        .catch(err => console.error("Error fetching stats:", err));
};

// Load data based on selected crypto and date range
const loadData = async () => {
    selectedCrypto = document.getElementById('crypto-select').value;
    startDate = document.getElementById('start-date').value;
    endDate = document.getElementById('end-date').value;

    if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
    }

    // Fetch data for the selected cryptocurrency
    const data = await fetchData(selectedCrypto, startDate, endDate);
    updateCharts(data);
    updateStats(selectedCrypto);
};

// Initialize
window.onload = () => {
    document.getElementById('load-data-btn').addEventListener('click', loadData);  // Attach click event to button
    loadData();  // Load default data on page load
};
