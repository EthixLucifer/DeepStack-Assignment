const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const CandleAuctionModule = buildModule("CandleAuctionModule", (m) => {
  const nft = m.contract("NFT");

  // Replace these with the actual values for your deployment
  const vrfCoordinator = "0x343300b5d84D444B2ADc9116FEF1bED02BE49Cf2";
  const keyHash = "0x816bedba8a50b294e5cbd47842baf240c2385f2eaf719edbd4f250a137a8c899";
  const subscriptionId = 4770084190029772705768595926798226884560589758950304855731850812408104746629n; // Your subscription ID
  const callbackGasLimit = 100000;
  const requestConfirmations = 3;

  const candleAuction = m.contract("CandleAuction", [
    vrfCoordinator,
    keyHash,
    subscriptionId,
    callbackGasLimit,
    requestConfirmations,
    nft,
  ]);

  // Transfer ownership of NFT contract to CandleAuction contract
  m.call(nft, "transferOwnership", [candleAuction]);

  return { nft, candleAuction };
});

module.exports = CandleAuctionModule;
