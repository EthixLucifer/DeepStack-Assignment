require("@chainlink/hardhat-chainlink");
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  chainlink: {
    confirmations: 1 // Number of confirmations to wait for transactions
  },
};
