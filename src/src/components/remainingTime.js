// src/components/GetTimeRemaining.js
import React, { useState } from "react";
import { getContract } from "../utils/web3";
import CandleAuction_ABI from "../abi/Auction.json";
import { CONTRACT_ADDRESSES } from "../config";


const GetTimeRemaining = () => {
  const [itemId, setItemId] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [error, setError] = useState(null);

  const fetchTimeRemaining = async () => {
    try {
      const candleContract = await getContract(CONTRACT_ADDRESSES.CandleAuction, CandleAuction_ABI);
      const time = await candleContract.getTimeRemaining(itemId);
      setTimeRemaining(time.toString());
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching time remaining:", error);
      setError(error.message);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={itemId}
        onChange={(e) => setItemId(e.target.value)}
        className="border p-2 mb-2 w-48 m-9"
        placeholder="Enter Item ID"
      />
      <button className="bg-blue-500 text-white px-4 py-2" onClick={fetchTimeRemaining}>Get Time Remaining</button>
      {timeRemaining && <div className="mt-2">Time Remaining: {timeRemaining} blocks</div>}
      {error && <div className="text-red-500 mt-2">Error: {error}</div>}
    </div>
  );
};

export default GetTimeRemaining;
