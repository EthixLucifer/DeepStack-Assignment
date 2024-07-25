// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "./candleAuctionNFT.sol";

contract CandleAuction is VRFConsumerBaseV2Plus, IERC721Receiver {
    struct ItemDetail {
        uint256 itemId;
        string itemName;
        string itemURI;
        bool isListed;
    }

    struct Auction {
        uint256 startTime;
        uint256 endTime;
        bool auctionEnded;
        address highestBidder;
        uint256 highestBid;
        mapping(address => uint256) bids;
    }

    NFT public nftContract;
    ItemDetail[] public items;
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => address) public itemWinners;
    mapping(uint256 => uint256) public requestIdToItemId;

    event ItemListed(uint256 itemId, string itemName, string itemURI);
    event AuctionStarted(uint256 endTime, uint256 itemId, string itemName);
    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount, uint256 itemId, string itemName);

    VRFCoordinatorV2Interface COORDINATOR;
    address vrfCoordinator;
    uint256 s_subscriptionId;
    bytes32 keyHash;
    uint32 callbackGasLimit;
    uint16 requestConfirmations;
    uint32 numWords;
    // Chainlink VRF variables
     // Chainlink VRF variables

    //     VRFCoordinatorV2Interface COORDINATOR; // msg.sender
    //     uint64 s_subscriptionId; // amoy = 4770084190029772705768595926798226884560589758950304855731850812408104746629
    //     address vrfCoordinator; // amoy = 0x7E10652Cb79Ba97bC1D0F38a1e8FaD8464a8a908
    //     bytes32 keyHash; // 0x3f631d5ec60a0ce16203bcd6aff7ffbc423e22e452786288e172d467354304c8
    //     uint32 callbackGasLimit; // 40000
    //     uint16 requestConfirmations; // 3 
    //     uint32 numWords; // 1
    //     NFT Amoy Address: 0xa7526adcDc553Bb9588fAaB780c6d93C4Db39df4
    //     CandleAuction: 0x24f7403d2E3964D7f3041b81D11FBBc20ADbC945 

    constructor(
        address _vrfCoordinator,
        bytes32 _keyHash,
        uint256 _subscriptionId,
        uint32 _callbackGasLimit,
        uint16 _requestConfirmations,
        address _nftContract
    ) 
        VRFConsumerBaseV2Plus(_vrfCoordinator)
    {
        vrfCoordinator = _vrfCoordinator;
        keyHash = _keyHash;
        s_subscriptionId = _subscriptionId;
        callbackGasLimit = _callbackGasLimit;
        requestConfirmations = _requestConfirmations;
        numWords = 1;
        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
        nftContract = NFT(_nftContract);
    }

    modifier onlyBeforeEnd(uint256 _itemId) {
        require(block.number < auctions[_itemId].endTime, "Auction already ended");
        _;
    }

    modifier onlyAfterEnd(uint256 _itemId) {
        require(block.number >= auctions[_itemId].endTime, "Auction not yet ended");
        _;
    }

    function listItem(string memory _itemName, string memory _itemURI) public onlyOwner {
        uint256 newItemId = nftContract.createNFT(address(this), _itemURI);
        items.push(ItemDetail({
            itemId: newItemId,
            itemName: _itemName,
            itemURI: _itemURI,
            isListed: true
        }));
        emit ItemListed(newItemId, _itemName, _itemURI);
    }

    function startAuction(uint256 _itemId) public onlyOwner {
        require(items[_itemId].isListed, "Item not listed for auction");
        require(auctions[_itemId].startTime == 0, "Auction already started for this item");
        
        auctions[_itemId].startTime = block.number;
        requestRandomEndTime(_itemId);
    }

    function requestRandomEndTime(uint256 _itemId) internal {
       uint256 requestId = s_vrfCoordinator.requestRandomWords(
        VRFV2PlusClient.RandomWordsRequest({
            keyHash: keyHash,
            subId: s_subscriptionId,
            requestConfirmations: requestConfirmations,
            callbackGasLimit: callbackGasLimit,
            numWords: numWords,
            extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: false}))
        })
       );

        requestIdToItemId[requestId] = _itemId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) internal override {
        uint256 _itemId = requestIdToItemId[requestId];
        uint randomBlocks = 20 + (randomWords[0] % 11); // 20 to 30 blocks
        auctions[_itemId].endTime = auctions[_itemId].startTime + randomBlocks;
        emit AuctionStarted(auctions[_itemId].endTime, items[_itemId].itemId, items[_itemId].itemName);
    }

    function bid(uint256 _itemId) public payable onlyBeforeEnd(_itemId) {
        require(msg.value > auctions[_itemId].highestBid, "There already is a higher bid");

        if (auctions[_itemId].highestBidder != address(0)) {
            auctions[_itemId].bids[auctions[_itemId].highestBidder] += auctions[_itemId].highestBid;
        }

        auctions[_itemId].highestBidder = msg.sender;
        auctions[_itemId].highestBid = msg.value;
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    function withdraw(uint256 _itemId) internal returns (bool) {
        uint256 amount = auctions[_itemId].bids[msg.sender];
        if (amount > 0) {
            auctions[_itemId].bids[msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                auctions[_itemId].bids[msg.sender] = amount;
                return false;
            }
        }
        return true;
    }

    function endAuction(uint256 _itemId) public onlyOwner onlyAfterEnd(_itemId) {
        require(!auctions[_itemId].auctionEnded, "Auction end has already been called for this item");

        auctions[_itemId].auctionEnded = true;
        itemWinners[items[_itemId].itemId] = auctions[_itemId].highestBidder;
        emit AuctionEnded(auctions[_itemId].highestBidder, auctions[_itemId].highestBid, items[_itemId].itemId, items[_itemId].itemName);

        // Transfer the NFT to the winner
        nftContract.safeTransferFrom(address(this), auctions[_itemId].highestBidder, items[_itemId].itemId);

        // Transfer the highest bid amount to the owner
        payable(owner()).transfer(auctions[_itemId].highestBid);
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        // Implement your custom logic here
        return this.onERC721Received.selector;
    }
}
