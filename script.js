// Fetch Bitcoin data from CoinGecko API
const fetchData = async () => {
    const url = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=1606780800&to=1617148800'; // Dec 2020 to Mar 2021
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log('Data fetched successfully:', data);  // Add this for debugging
        return data.prices;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

// Convert UNIX timestamp to a readable date
const formatDate = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
};

// Display Bitcoin price chart
const displayChart = (data) => {
    const ctx = document.getElementById('bitcoin-chart').getContext('2d');
    const dates = data.map(([timestamp]) => formatDate(timestamp));
    const prices = data.map(([_, price]) => price);

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
    const prices = await fetchData();
    if (prices.length === 0) {
        document.querySelector('#price-table tbody').innerHTML = '<tr><td colspan="2">No data available</td></tr>';
        return;
    }

    const tableBody = document.querySelector("#price-table tbody");
    prices.forEach(([timestamp, price]) => {
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const priceCell = document.createElement('td');
        
        dateCell.textContent = formatDate(timestamp);
        priceCell.textContent = `$${price.toFixed(2)}`;
        
        row.appendChild(dateCell);
        row.appendChild(priceCell);
        tableBody.appendChild(row);
    });
};

// Handle loading spinner visibility
const showLoading = () => {
    document.getElementById('loading-spinner').style.display = 'flex';
};

const hideLoading = () => {
    document.getElementById('loading-spinner').style.display = 'none';
};

// Initialize page
const initialize = async () => {
    showLoading();
    const prices = await fetchData();
    hideLoading();

    if (prices.length === 0) {
        alert("Failed to load data.");
    } else {
        displayChart(prices);
        displayTable();
    }
};

// Call the initialization function once the page loads
window.onload = initialize;
