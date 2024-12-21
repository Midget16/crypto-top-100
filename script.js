// Your CryptoCompare API Key (replace with your actual API key)
const apiKey = 'YOUR_CRYPTOCOMPARE_API_KEY';

// Fetch Bitcoin data from CryptoCompare API
const fetchData = async (fromTs, toTs) => {
    const url = 'https://min-api.cryptocompare.com/data/v2/histoday';

    const params = new URLSearchParams({
        fsym: 'BTC', // Symbol for Bitcoin
        tsym: 'USD', // Convert to USD
        toTs: toTs,  // End date (March 31, 2021)
        limit: 2000,  // Limit to 2000 data points (could adjust based on data)
        e: 'CCCAGG',  // Data source
    });

    try {
        const response = await fetch(`${url}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Apikey ${apiKey}`, // Include the API key in the header
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        return data.Data.Data; // Return the historical data
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

// Convert UNIX timestamp to a readable date
const formatDate = timestamp => {
    const date = new Date(timestamp * 1000);  // Convert seconds to milliseconds
    return date.toLocaleDateString();
};

// Display Bitcoin price chart
const displayChart = (data) => {
    const ctx = document.getElementById('bitcoin-chart').getContext('2d');
    const dates = data.map(item => formatDate(item.time));
    const prices = data.map(item => item.close);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Bitcoin Price (USD)',
                data: prices,
                fill: false,
                borderColor: '#4CAF50',
                tension: 0.1,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: { autoSkip: true, maxTicksLimit: 10 },
                },
                y: {
                    beginAtZero: false,
                }
            }
        }
    });
};

// Display data in the table
const displayTable = async () => {
    const prices = await fetchData(1606780800, 1617148800); // Request data between Dec 1, 2020 and Mar 31, 2021
    if (prices.length === 0) {
        document.querySelector('#price-table tbody').innerHTML = '<tr><td colspan="2">No data available</td></tr>';
        return;
    }

    const tableBody = document.querySelector("#price-table tbody");
    prices.forEach(item => {
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const priceCell = document.createElement('td');
   
