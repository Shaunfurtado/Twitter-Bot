#  Tether Transaction Tracker Twitter Bot with Etherscan API
This project is a Node.js Twitter bot that leverages the Etherscan API to track large Tether (USDT) transactions and automatically posts tweets about them.

## Features:
- Monitors transactions on the Ethereum blockchain for a specific Tether contract address.
- Filters for transactions exceeding a configurable minimum threshold (20,000 USDT by default).
- Creates tweets containing details like sender and receiver addresses, amount transferred, and transaction URL.
- Posts tweets on a configurable interval (5 seconds by default) using Twitter API v2 with OAuth 2.0 authentication.

## Setup:
- Clone the repository.

- Install dependencies: 
    `npm  install`

- Configure your Twitter API credentials and Etherscan API key in the bot.js file.
- Adjust the minimum Tether value threshold and tweet posting interval if desired.
Run the bot: `node bot.js`


### Usage:
The bot will run continuously, fetching data from Etherscan, processing transactions, and posting tweets about significant Tether transfers. You can also view the console logs for more details of its activity.