# 1. For Smart Contract Setup... Go to Contracts Directory
Accounts, Demo Private Key for Test Purpose, and APIs are already present in the respective files.

Polygon Amoy Testnet is being Used for Contract Deployment.

There are Two Smart Contracts: 

candleAuctionNFT.sol
This smart contract is used to mint NFTs of the items listed in the auction and transfer them to the CandleAuction Contract.

deepstack.sol
This smart contract is used to list the items for auction, bid on the items, and transfer the NFTs to the highest bidder by following Candle Auction via using the Chainlink VRF2.5 Oracle.

One Only needs to execute commands in the given following order:

cd contracts 

npm install

cd contracts/ignition/modules

get the subscription Id for the Chainlink VRF2.5 Oracle and Fund via the chainlink faucet LINK tokens your Subscription. (For the Purpose of Assignment Evaluation this step has been done already, no need to do this step)


Get the Chainlink VRF 2.5 Configuration from Here (https://docs.chain.link/vrf/v2-5/supported-networks#polygon-amoy-testnet) and 
edit the respected values in deploy.js (For the Purpose of Assignment Evaluation this step has been done already, no need to do this step)

    vrfCoordinator,
    keyHash,
    subscriptionId,
    callbackGasLimit,
    requestConfirmations


npx hardhat ignition deploy ./ignition/modules/deploy.js --network amoy 

This command will give Deploy the module and give address of the deployed contract on the Amoy testnet. like the below example (For the Purpose of Assignment Evaluation this step has been done already, no need to do this step)


Batch #1
  Executed CandleAuctionModule#NFT

Batch #2
  Executed CandleAuctionModule#CandleAuction

Batch #3
  Executed CandleAuctionModule#NFT.transferOwnership

[ CandleAuctionModule ] successfully deployed 🚀

Deployed Addresses

CandleAuctionModule#NFT - 0x65D16498c3fEA88cc9dD7Fb5297719A17fB56245
CandleAuctionModule#CandleAuction - 0x1a96FF49507d9f70ad2A6404b69b36b8FAb94AA7

Take the deployed address of the CandleAuction smart contract and add it as consumer in the Subscription Id page of the Chainlink VRF2.5 Oracle. (https://vrf.chain.link/polygon-amoy/4770084190029772705768595926798226884560589758950304855731850812408104746629)




# Getting Started with Frontend Section

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.



