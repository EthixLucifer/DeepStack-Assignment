// src/components/ItemList.js
import React, { useEffect, useState } from "react";
import { getContract } from "../utils/web3";
import AUCTION_ABI from "../abi/Auction.json";

import { CONTRACT_ADDRESSES } from "../config";


const ItemList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const auctionContract = await getContract(CONTRACT_ADDRESSES.CandleAuction, AUCTION_ABI);
        const itemCount = await auctionContract.items.length;

        const items = [];
        for (let i = 0; i < itemCount; i++) {
          const item = await auctionContract.items(i);
          items.push(item);
          console.log(items)
        }

        setItems(items);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchItems();
  }, []);

  const startAuction = async (itemId) => {
    try {
      const auctionContract = await getContract(CONTRACT_ADDRESSES.CandleAuction, AUCTION_ABI); 
      await auctionContract.startAuction(itemId);
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div key={index} className="border p-4">
            <h3 className="text-xl">{item.itemName}</h3>
            <img src={item.itemURI} alt={item.itemName} className="w-48 m-9 h-48 object-cover" />
            <button className="bg-blue-500 text-white px-4 py-2 mt-2" onClick={() => startAuction(item.itemId)}>Start Auction</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemList;
