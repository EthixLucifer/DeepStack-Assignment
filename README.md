# Smart Contract Setup

## Overview
This project uses the Polygon Amoy Testnet for contract deployment. There are two smart contracts involved:

1. **candleAuctionNFT.sol**: This contract mints NFTs for the items listed in the auction and transfers them to the CandleAuction contract.
2. **deepstack.sol**: This contract lists items for auction, handles bidding, and transfers NFTs to the highest bidder using the Chainlink VRF2.5 Oracle.

## Prerequisites
Accounts, demo private keys for testing purposes, and APIs are already provided in the respective files.

## Steps to Deploy

1. Navigate to the contracts directory:
    ```sh
    cd contracts
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Navigate to the Ignition modules directory:
    ```sh
    cd contracts/ignition/modules
    ```

4. **Chainlink VRF2.5 Oracle Setup**:
    - Get the subscription ID for the Chainlink VRF2.5 Oracle and fund it with LINK tokens using the Chainlink faucet.
    - Retrieve the Chainlink VRF 2.5 configuration from [Chainlink VRF2.5 Documentation](https://docs.chain.link/vrf/v2-5/supported-networks#polygon-amoy-testnet).
    - Update the following values in `deploy.js`:
      ```javascript
      vrfCoordinator,
      keyHash,
      subscriptionId,
      callbackGasLimit,
      requestConfirmations
      ```
    *(For the purpose of assignment evaluation, this step has already been completed.)*

5. Deploy the module:
    ```sh
    npx hardhat ignition deploy ./ignition/modules/deploy.js --network amoy
    ```
    This command will deploy the module and provide the addresses of the deployed contracts on the Amoy testnet. Example output:
    ```
    Batch #1
      Executed CandleAuctionModule#NFT

    Batch #2
      Executed CandleAuctionModule#CandleAuction

    Batch #3
      Executed CandleAuctionModule#NFT.transferOwnership

    [ CandleAuctionModule ] successfully deployed 🚀

    Deployed Addresses:
    CandleAuctionModule#NFT - 0x65D16498c3fEA88cc9dD7Fb5297719A17fB56245
    CandleAuctionModule#CandleAuction - 0x1a96FF49507d9f70ad2A6404b69b36b8FAb94AA7
    ```
    *(For the purpose of assignment evaluation, this step has already been completed.)*

6. Add the deployed CandleAuction contract address as a consumer on the Chainlink VRF2.5 Oracle subscription ID page: [Chainlink VRF Consumer Page](https://vrf.chain.link/polygon-amoy/4770084190029772705768595926798226884560589758950304855731850812408104746629).

# Frontend Setup

## Getting Started
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts
In the project directory, you can run:

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes. You may also see any lint errors in the console.