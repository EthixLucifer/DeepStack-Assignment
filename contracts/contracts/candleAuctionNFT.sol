
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract NFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    constructor() ERC721("DeepStack Auction", "DSA") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function createNFT(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 newItemId = tokenCounter;
        _safeMint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        tokenCounter += 1;
        return newItemId;
    }
}

// NFT Amoy Address: 0xa7526adcDc553Bb9588fAaB780c6d93C4Db39df4