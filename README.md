# Smart Contract Setup

## Overview: Chainlink VRF2.5 Based Candle Auction Dapp
1. DeepStack Candle Auction uses the Polygon Amoy Testnet for contract deployment. There are two smart contracts involved:
2. In case metamask gives Internal JSON RPC Error simply go to setting -> Advanced -> Clear Activity Tab

3. Also ensure to login into the Admin wallet Address for run administrative authorized tasks. It's Metamask private key is provided in the hardhat.config.js
 
1. **candleAuctionNFT.sol**: This contract mints NFTs for the items listed in the auction and transfers them to the CandleAuction contract.
2. **deepstack.sol**: This contract lists items for auction, handles bidding, and transfers NFTs to the highest bidder using the Chainlink VRF2.5 Oracle.

## Prerequisites
Accounts, demo private keys for testing purposes, and APIs are already provided in the respective files.

1. NPM and Node.js are required to install the dependencies and run the frontend.

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
    CandleAuctionModule#NFT - 0x152616B7E738A0E671b9AFcC9c956b97d2b96Bf3
    CandleAuctionModule#CandleAuction - 0xa9dc1e9c25949DEc687C93619d9a26BFB4702F32
    ```
    *(For the purpose of assignment evaluation, this step has already been completed.)*

6. Add the deployed CandleAuction contract address as a consumer on the Chainlink VRF2.5 Oracle subscription ID page: [Chainlink VRF Consumer Page](https://vrf.chain.link/polygon-amoy/4770084190029772705768595926798226884560589758950304855731850812408104746629).

# Frontend Setup

### `cd src`

### `npm install`

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes. You may also see any lint errors in the console.