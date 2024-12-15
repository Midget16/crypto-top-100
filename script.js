document.addEventListener('DOMContentLoaded', function() {
  const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';

  // Fetch the top 100 crypto coins data from CoinGecko API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const cryptoDataContainer = document.getElementById('crypto-data');
      
      data.forEach((coin, index) => {
        const row = document.createElement('tr');

        // Create table cells for each column
        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;

        const nameCell = document.createElement('td');
        const nameLink = document.createElement('a');
        
        // Build the full URL for the coin page
        const coinUrl = `https://www.coingecko.com/en/coins/${coin.id}`;
        
        // Set the link properties
        nameLink.href = coinUrl;
        nameLink.target = '_blank';
        nameLink.textContent = coin.name;
        nameCell.appendChild(nameLink);

        const symbolCell = document.createElement('td');
        symbolCell.textContent = coin.symbol.toUpperCase();

        const priceCell = document.createElement('td');
        priceCell.textContent = `$${coin.current_price.toLocaleString()}`;

        const marketCapCell = document.createElement('td');
        marketCapCell.textContent = `$${coin.market_cap.toLocaleString()}`;

        const volumeCell = document.createElement('td');
        volumeCell.textContent = `$${coin.total_volume.toLocaleString()}`;

        const changeCell = document.createElement('td');
        changeCell.textContent = `${coin.price_change_percentage_24h.toFixed(2)}%`;

        // Apply color based on price change (green if positive, red if negative)
        if (coin.price_change_percentage_24h > 0) {
          changeCell.classList.add('change-up');
        } else {
          changeCell.classList.add('change-down');
        }

        // Append cells to the row
        row.appendChild(rankCell);
        row.appendChild(nameCell);
        row.appendChild(symbolCell);
        row.appendChild(priceCell);
        row.appendChild(marketCapCell);
        row.appendChild(volumeCell);
        row.appendChild(changeCell);

        // Append the row to the table body
        cryptoDataContainer.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error fetching crypto data:', error);
    });
});
