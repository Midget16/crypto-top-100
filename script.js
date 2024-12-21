// Fetch Bitcoin data from CoinGecko API
const fetchData = async () => {
    const url = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=1606780800&to=1617148800'; // Dec 2020 to Mar 2021
    const response = await fetch(url);
    const data = await response.json();
    return data.prices;
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
    displayChart(prices);
    displayTable();
};

// Call the initialization function once the page loads
window.onload = initialize;

