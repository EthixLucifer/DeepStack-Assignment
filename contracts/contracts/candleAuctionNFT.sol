
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


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

