// Your CryptoCompare API Key (replace with your actual API key)
const apiKey = 'YOUR_CRYPTOCOMPARE_API_KEY';

// Fetch Bitcoin data from CryptoCompare API
const fetchData = async () => {
    const url = 'https://min-api.cryptocompare.com/data/v2/histoday';
    
    // Set start date to December 1, 2020 (timestamp: 1606780800) and end date to March 31, 2021 (timestamp: 1617148800)
    const fromTs = 1606780800; // Dec 1, 2020
    const toTs = 1617148800;   // Mar 31, 2021
    const params = new URLSearchParams({
        fsym: 'BTC', // Symbol for Bitcoin
        tsym: 'USD', // Convert to USD
        toTs: toTs,  // End of March 2021 timestamp
        limit: 2000,  // Limit to 2000 data points
        e: 'CCCAGG',  // Data source
        to: toTs,     // To the specified end date
        extraParams: 'yourAppName' // Optional app name for rate limiting (replace with your app name)
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
        console.log('Data fetched successfully:', data);  // Add this for debugging
        return data.Data.Data; // Access the historical data
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
    const prices = await fetchData();
    if (prices.length === 0) {
        document.querySelector('#price-table tbody').innerHTML = '<tr><td colspan="2">No data available</td></tr>';
        return;
    }

    const tableBody = document.querySelector("#price-table tbody");
    prices.forEach(item => {
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const priceCell = document.createElement('td');
        
        dateCell.textContent = formatDate(item.time);
        priceCell.textContent = `$${item.close.toFixed(2)}`;
        
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
