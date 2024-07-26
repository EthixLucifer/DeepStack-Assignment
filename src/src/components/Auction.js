import React, { useState, useEffect } from "react";
import { getContract } from "../utils/web3";
import AUCTION_ABI from "../abi/Auction.json";

const auctionAddress = "0x1a96FF49507d9f70ad2A6404b69b36b8FAb94AA7";

const Auction = ({ itemId }) => {
  const [auction, setAuction] = useState({});
  const [bid, setBid] = useState(0);

  useEffect(() => {
    const fetchAuction = async () => {
      const auctionContract = getContract(auctionAddress, AUCTION_ABI);
      const auctionDetails = await auctionContract.auctions(itemId);
      setAuction(auctionDetails);
    };

    fetchAuction();
  }, [itemId]);

  const placeBid = async () => {
    const auctionContract = getContract(auctionAddress, AUCTION_ABI);
    await auctionContract.bid(itemId, { value: ethers.utils.parseEther(bid) });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Auction for Item {itemId}</h2>
      <p>Highest Bid: {ethers.utils.formatEther(auction.highestBid)} ETH</p>
      <p>Highest Bidder: {auction.highestBidder}</p>
      <input
        type="number"
        value={bid}
        onChange={(e) => setBid(e.target.value)}
        className="border p-2 mr-2"
        placeholder="Enter your bid"
      />
      <button className="bg-green-500 text-white px-4 py-2" onClick={placeBid}>Place Bid</button>
    </div>
  );
};

export default Auction;
