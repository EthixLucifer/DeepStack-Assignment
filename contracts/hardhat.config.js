require("@nomicfoundation/hardhat-toolbox");
// require("@nomicfoundation/hardhat-ignition-ethers");


// require("@nomiclabs/hardhat-ethers");
// require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
      {
        version: "0.8.20",
      },
    ],
  },
  networks: {
    amoy: {
      // For striaghtforward deployment i've used APIs & pvt key Directly 
      // In real world these confidential items would've been in a .env file
      url: `https://polygon-amoy.infura.io/v3/312d3f9da44b4164b33fe8739032901e`, // Infura API Key 
      accounts: [`c51d87b35537032f2fcf14c842015fb0ae5da9d96cfe4d7b43e4e4134038fcdc`] //DeepStack Account Pvt Key
    }
  }
};
