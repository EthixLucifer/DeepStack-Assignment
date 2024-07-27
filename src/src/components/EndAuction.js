// src/components/EndAuction.js
import React, { useState } from "react";
import { getContract } from "../utils/web3";
import CandleAuction_ABI from "../abi/Auction.json";

import { CONTRACT_ADDRESSES } from "../config";

const EndAuction = () => {
  const [itemId, setItemId] = useState("");
  const [itemId1, setItemId1] = useState("");
  const [error, setError] = useState(null);

  const startAuction = async () => {
    try {
      const candleContract = await getContract(CONTRACT_ADDRESSES.CandleAuction, CandleAuction_ABI);
      await candleContract.startAuction(itemId1);
      setError(null);
    }
    catch (error) {
      console.error("Error ending auction:", error);
      setError(error.message);
    }
  };

  const endAuction = async () => {
    try {
      const candleContract = await getContract(CONTRACT_ADDRESSES.CandleAuction, CandleAuction_ABI);
      await candleContract.endAuction(itemId);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error ending auction:", error);
      setError(error.message);
    }
  };

  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Start Auction</h2>

        <input
          type="text"
          value={itemId1}
          onChange={(e) => setItemId1(e.target.value)}
          className="border p-2 mb-2 w-48 m-9 m-9"
          placeholder="Enter Item ID"
        />
        <button className="bg-yellow-500 text-white px-4 py-2" onClick={startAuction}>Start Auction</button>
        {error && <div className="text-red-500 mt-2">Error: {error}</div>}
      </div>
      <div className="p-4">

        
        <h2 className="text-2xl font-bold mb-4">End an Ongoing Auction</h2>

        <input
          type="text"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          className="border p-2 mb-2 w-48 m-9 m-9"
          placeholder="Enter Item ID"
        />
        <button className="bg-yellow-500 text-white px-4 py-2" onClick={endAuction}>End Auction</button>
        {error && <div className="text-red-500 mt-2">Error: {error}</div>}
      </div>
    </div>
  );
};

export default EndAuction;
