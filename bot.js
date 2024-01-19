const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { TwitterApi } = require('twitter-api-v2');

// Twitter API v2 credentials 
const client = new TwitterApi({
    appKey: 'PiUxcMnKJUwo6JSHvZVw0UPfR',  // API KEY
    appSecret: 'QHS3uXjlkEGEwKjn5IVE71kpn5CSpm18gaahatx9LRpCKEBBJT',  //API SECRET KEY
    accessToken: '1746379139504857088-hKk8EXHnGC3Zo51CyK5LdzOpY4WwVb',  //ACCESS TOKEN
    accessSecret: 'tzWvOIj01pk8E4mu795RKsPJnNG58wZWWando4t7Uj9UX' //ACCESS TOKEN SECRET
});

const app = express();
const port = 5002;

app.use(bodyParser.json());

// Function to post a tweet using OAuth 2.0
async function postTweet(tweet) {
  console.log('Attempting to post tweet:', tweet);
  try {
      const response = await client.v2.tweet('statuses/update', { text: tweet });
      console.log('Tweet posted successfully:', response.data);
  } catch (error) {
      console.error('Error posting tweet:', error.message, error.statusCode);
  }
}
// Send a demo tweet and start the server
app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);

  try {
    await postTweet('This is a demo tweet from my Twitter bot!');
  } catch (error) {
    console.error('Error sending demo tweet:', error.message);
  }
});

async function fetchDataAndTweet() {
  try {
    const response = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'account',
        action: 'tokentx',
        contractaddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        startblock: '0',
        endblock: '99999999',
        sort: 'desc',  
        page: 1,      
        offset: 1,   
        apikey: 'QTWXWBU7QJ6SIZXYPZA2FC57P14F24EG9K' // Your Etherscan API Key
      }
    });

    console.log('Etherscan API response:', response.data);

    if (response.status === 200 && response.data && response.data.result) {
      const transactions = response.data.result;
    
      // Check all transactions
      for (let tx of transactions) {
        // Get the Tether value in decimal format
        const tetherValue = parseInt(tx.value) / (10 ** tx.tokenDecimal);
    
        if (tetherValue > 20000) {
          // Process the transaction and send the tweet
          const sender = tx.from.slice(0, 6) + '...' + tx.from.slice(-3) + '...';
          const receiver = tx.to.slice(0, 6) + '...' + tx.to.slice(-3) + '...';
          const tokenName = 'Tether';
          const transactionHash = tx.hash;
          const formattedValue = `$${tetherValue.toFixed(6)}`;
          const transactionUrl = `https://etherscan.io/tx/${transactionHash}`;

          const tweet = `New Buyer Alert! ${sender} sent ${formattedValue} ${tokenName} to ${receiver}! in transaction ${transactionUrl}`;

          console.log(tweet);
          await postTweet(tweet);
          break;  // Exit the loop after finding the first transaction over 20000
        }
      }
    } else {
      console.error('Invalid or missing data in the Etherscan API response');
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

// Call fetchDataAndTweet once when the server starts
fetchDataAndTweet();

// Schedule to fetch data and tweet every 5 seconds
setInterval(fetchDataAndTweet, 5000);

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Server is running.');
});
