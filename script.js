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

// Fixed date range: December 1, 2020 to March 31, 2021
const startDate = '2020-12-01';
const endDate = '2021-03-31';

// Fetching data from CryptoCompare
const fetchData = async (crypto) => {
    const startTs = new Date(startDate).getTime() / 1000;
    const endTs = new Date(endDate).getTime() / 1000;

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

// Calculate percentage change between consecutive days
const calculatePercentageChange = (data) => {
    const percentageChanges = [];
    for (let i = 1; i < data.length; i++) {
        const previousPrice = data[i - 1].close;
        const currentPrice = data[i].close;
        const percentageChange = ((currentPrice - previousPrice) / previousPrice) * 100;
        percentageChanges.push(percentageChange);
    }
    return percentageChanges;
};

// Prepare chart data
const prepareChartData = (data) => {
    const labels = data.map(item => new Date(item.time * 1000).toLocaleDateString()); // Labels (dates)
    const percentageChanges = calculatePercentageChange(data); // Percentage change for y-axis
    return { labels, percentageChanges };
};

// Update charts
const updateCharts = (cryptosData) => {
    const labels = cryptosData[0].data.map(item => new Date(item.time * 1000).toLocaleDateString()); // Dates for x-axis

    const datasets = cryptosData.map((cryptoData, index) => {
        const percentageChanges = calculatePercentageChange(cryptoData.data);
        return {
            label: cryptoData.crypto,
            data: percentageChanges,
            borderColor: getRandomColor(),
            fill: false,
            tension: 0.1,
        };
    });

    const priceChart = new Chart(document.getElementById('price-chart').getContext('2d'), {
        type: 'line',
        data: {
            labels, // Dates as x-axis
            datasets,
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date', // x-axis label
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Percentage Change (%)', // y-axis label
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(2) + '%'; // Format y-axis values as percentage
                        }
                    },
                }
            }
        }
    });
};

// Random color generator for line charts
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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

// Load data based on selected crypto(s)
const loadData = async () => {
    const selectedCryptos = Array.from(document.getElementById('crypto-select').selectedOptions).map(option => option.value);
    
    if (selectedCryptos.length === 0) {
        alert("Please select at least one cryptocurrency.");
        return;
    }

    // Fetch data for the selected cryptocurrencies
    const cryptosData = await Promise.all(selectedCryptos.map(async (crypto) => {
        const data = await fetchData(crypto);
        return { crypto, data };
    }));

    updateCharts(cryptosData);
    updateStats(selectedCryptos[0]); // Update stats for the first selected crypto
};

// Initialize
window.onload = () => {
    document.getElementById('load-data-btn').addEventListener('click', loadData);  // Attach click event to button
    loadData();  // Load default data on page load
};
