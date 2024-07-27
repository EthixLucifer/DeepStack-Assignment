// src/components/WithdrawBid.js
import React, { useState } from "react";
import { getContract } from "../utils/web3";
import CandleAuction_ABI from "../abi/Auction.json";

import { CONTRACT_ADDRESSES } from "../config";

const WithdrawBid = () => {
    const [itemId, setItemId] = useState("");
    const [error, setError] = useState(null);

    const withdrawBid = async () => {
        try {
            const candleContract = await getContract(CONTRACT_ADDRESSES.CandleAuction, CandleAuction_ABI);
            await candleContract.withdraw(itemId);
            setError(null); // Clear any previous errors
        } catch (error) {
            console.error("Error withdrawing bid:", error);
            setError(error.message);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Withdraw Your Bids</h2>

            <input
                type="text"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                className="border p-2 mb-2 w-48 m-9"
                placeholder="Enter Item ID"
            />
            <button className="bg-red-500 text-white px-4 py-2" onClick={withdrawBid}>Withdraw Bid</button>
            {error && <div className="text-red-500 mt-2">Error: {error}</div>}
        </div>
    );
};

export default WithdrawBid;
