
    // Chainlink VRF variables
    // Chainlink VRF variables

    //     uint64 s_subscriptionId; // amoy = 4770084190029772705768595926798226884560589758950304855731850812408104746629
    //     address vrfCoordinator; // amoy = 0x343300b5d84D444B2ADc9116FEF1bED02BE49Cf2
    //     bytes32 keyHash; // 0x816bedba8a50b294e5cbd47842baf240c2385f2eaf719edbd4f250a137a8c899
    //     uint32 callbackGasLimit; // 40000
    //     uint16 requestConfirmations; // 3
    //     uint32 numWords; // 1
    //     NFT Amoy Address:  0x23FB144d96Ef5aB49Be683c618a17a16334147e2
    //     CandleAuction:

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "./candleAuctionNFT.sol";

contract CandleAuction is VRFConsumerBaseV2Plus, IERC721Receiver, ReentrancyGuard {
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

    struct RequestStatus {
        bool fulfilled;
        bool exists;
        uint256[] randomWords;
    }

    NFT public nftContract;
    ItemDetail[] public items;
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => address) public itemWinners;
    mapping(uint256 => uint256) public requestIdToItemId;
    mapping(uint256 => RequestStatus) public s_requests;

    event ItemListed(uint256 itemId, string itemName, string itemURI);
    event AuctionStarted(uint256 endTime, uint256 itemId, string itemName);
    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount, uint256 itemId, string itemName);
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    // Chainlink VRF variables
    uint256 public s_subscriptionId;
    bytes32 public keyHash;
    uint32 public callbackGasLimit;
    uint16 public requestConfirmations;
    uint32 public numWords;

    /**
     * @dev Constructor to initialize the contract with necessary parameters.
     * @param _vrfCoordinator Address of the Chainlink VRF Coordinator.
     * @param _keyHash Hash of the VRF key.
     * @param _subscriptionId ID of the Chainlink subscription.
     * @param _callbackGasLimit Gas limit for the callback function.
     * @param _requestConfirmations Number of confirmations for the VRF request.
     * @param _nftContract Address of the NFT contract.
     */
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
        keyHash = _keyHash;
        s_subscriptionId = _subscriptionId;
        callbackGasLimit = _callbackGasLimit;
        requestConfirmations = _requestConfirmations;
        numWords = 1;
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

    /**
     * @dev Lists an item for auction.
     * @param _itemName Name of the item.
     * @param _itemURI URI of the item.
     */
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

    /**
     * @dev Starts an auction for a listed item.
     * @param _itemId ID of the item to auction.
     */
    function startAuction(uint256 _itemId) public onlyOwner {
        require(items[_itemId].isListed, "Item not listed");
        auctions[_itemId].startTime = block.number;
        requestRandomEndTime(_itemId);
    }

    /**
     * @dev Requests a random end time for the auction.
     * @param _itemId ID of the item.
     */
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

        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });

        requestIdToItemId[requestId] = _itemId;
        emit RequestSent(requestId, numWords);
    }

    /**
     * @dev Fulfills the random end time request and sets the auction end time.
     * @param requestId ID of the VRF request.
     * @param randomWords Array of random words returned by the VRF.
     */

    function fulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) internal override {
        require(s_requests[requestId].exists, "Request not found");
        s_requests[requestId].fulfilled = true;
        s_requests[requestId].randomWords = randomWords;
        emit RequestFulfilled(requestId, randomWords);

        uint256 _itemId = requestIdToItemId[requestId];
        uint256 randomBlocks = 20 + (randomWords[0] % 11); // 20 to 30 blocks
        auctions[_itemId].endTime = auctions[_itemId].startTime + randomBlocks;
        emit AuctionStarted(auctions[_itemId].endTime, items[_itemId].itemId, items[_itemId].itemName);
    }

    /**
     * @dev Places a bid on an auction.
     * @param _itemId ID of the item being auctioned.
     */
    function bid(uint256 _itemId) public payable onlyBeforeEnd(_itemId) nonReentrant {
        require(msg.value > auctions[_itemId].highestBid, "There already is a higher bid");

        if (auctions[_itemId].highestBidder != address(0)) {
            auctions[_itemId].bids[auctions[_itemId].highestBidder] += auctions[_itemId].highestBid;
        }

        auctions[_itemId].highestBidder = msg.sender;
        auctions[_itemId].highestBid = msg.value;
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    /**
     * @dev Allows bidders to withdraw their bids.
     * @param _itemId ID of the item being auctioned.
     */
    function withdraw(uint256 _itemId) public nonReentrant returns (bool) {
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

    /**
 * @dev Returns the time remaining for an ongoing auction.
 * @param _itemId ID of the item being auctioned.
 * @return timeRemaining Time remaining in blocks for the auction to end.
 */
function getTimeRemaining(uint256 _itemId) public view returns (uint256 timeRemaining) {
    require(items[_itemId].isListed, "Item not listed");
    require(!auctions[_itemId].auctionEnded, "Auction already ended");

    if (block.number >= auctions[_itemId].endTime) {
        return 0;
    } else {
        return auctions[_itemId].endTime - block.number;
    }
}


    /**
     * @dev Ends an auction and transfers the NFT to the winner.
     * @param _itemId ID of the item being auctioned.
     */
    function endAuction(uint256 _itemId) public onlyOwner onlyAfterEnd(_itemId) nonReentrant {
        require(!auctions[_itemId].auctionEnded, "Auction end has already been called for this item");

        auctions[_itemId].auctionEnded = true;
        itemWinners[items[_itemId].itemId] = auctions[_itemId].highestBidder;
        emit AuctionEnded(auctions[_itemId].highestBidder, auctions[_itemId].highestBid, items[_itemId].itemId, items[_itemId].itemName);

        // Transfer the NFT to the winner
        nftContract.safeTransferFrom(address(this), auctions[_itemId].highestBidder, items[_itemId].itemId);

        // Transfer the highest bid amount to the owner
        payable(owner()).transfer(auctions[_itemId].highestBid);
    }

    /**
     * @dev Handles receipt of an NFT.
     * @param operator Address which called `safeTransferFrom`.
     * @param from Address which previously owned the token.
     * @param tokenId ID of the token being transferred.
     * @param data Additional data with no specified format.
     * @return Selector for ERC721Receiver.
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    /**
     * @dev Gets the status of a random request.
     * @param _requestId ID of the request.
     * @return fulfilled Indicates if the request has been fulfilled.
     * @return randomWords Array of random words generated.
     */
    function getRequestStatus(uint256 _requestId) public view returns (bool fulfilled, uint256[] memory randomWords) {
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }
}
