// src/components/Auction.js
import React, { useState } from "react";
import { getContract } from "../utils/web3";
import AUCTION_ABI from "../abi/Auction.json";
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES } from "../config";
const Auction = () => {
  const [itemId, setItemId] = useState("");
  const [bid, setBid] = useState("");
  const [error, setError] = useState(null);
  const [auction, setAuction] = useState({});

  const fetchAuction = async () => {
    try {
      const auctionContract = await getContract(CONTRACT_ADDRESSES.CandleAuction, AUCTION_ABI);
      const auctionDetails = await auctionContract.auctions(itemId);
      setAuction({
        highestBid: auctionDetails.highestBid.toString(),
        highestBidder: auctionDetails.highestBidder,
        endTime: auctionDetails.endTime.toString()
      });
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching auction details:", error);
      setError(error.message);
    }
  };

  const placeBid = async () => {
    try {
      const auctionContract = await getContract(CONTRACT_ADDRESSES.CandleAuction, AUCTION_ABI);
      await auctionContract.bid(itemId, { value: ethers.parseEther(bid) });
      setError(null); // Clear any previous errors
      fetchAuction(); // Refresh auction details after placing a bid
    } catch (error) {
      console.error("Error placing bid:", error);
      setError(error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Place a Bid</h2>
      <input
        type="text"
        value={itemId}
        onChange={(e) => setItemId(e.target.value)}
        className="border p-2 mb-2 w-48 m-9"
        placeholder="Enter Item ID"
      />
      <button className="bg-blue-500 text-white px-4 py-2 mb-4" onClick={fetchAuction}>Fetch Auction</button>
      {auction.highestBid && <p>Highest Bid: {ethers.formatEther(auction.highestBid)} ETH</p>}
      <p>Highest Bidder: {auction.highestBidder}</p>
      <input
        type="text"
        value={itemId}
        onChange={(e) => setItemId(e.target.value)}
        className="border p-2 mb-2 w-48 m-9"
        placeholder="Enter Item ID"
      />
      <input
        type="number"
        value={bid}
        onChange={(e) => setBid(e.target.value)}
        className="border p-2 mr-2"
        placeholder="Enter your bid"
      />
      <button className="bg-green-500 text-white px-4 py-2" onClick={placeBid}>Place Bid</button>
      {error && <div className="text-red-500 mt-2">Error: {error}</div>}
    </div>
  );
};

export default Auction;
