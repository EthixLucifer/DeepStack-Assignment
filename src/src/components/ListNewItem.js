// src/components/ListNewItem.js
import React, { useState, useEffect } from "react";
import { getContract, getProvider } from "../utils/web3";
import { ethers } from "ethers";
import CandleAuction_ABI from "../abi/Auction.json";

import { CONTRACT_ADDRESSES } from "../config";
const ListNewItem = () => {
  const [name, setName] = useState("");
  const [uri, setUri] = useState("");
  const [events, setEvents] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const listenForEvents = async () => {
      const provider = getProvider();
      const CandleContract = new ethers.Contract(CONTRACT_ADDRESSES.CandleAuction, CandleAuction_ABI, provider);

      CandleContract.on("ItemListed", (itemId, itemName, itemURI) => {
        setEvents((prevEvents) => [
          ...prevEvents,
          { itemId: itemId.toString(), itemName, itemURI },
        ]);
      });

      return () => {
        CandleContract.removeAllListeners("ItemListed");
      };
    };

    listenForEvents();
  }, []);

  const listItem = async () => {
    try {
      const CandleContract = await getContract(CONTRACT_ADDRESSES.CandleAuction, CandleAuction_ABI);
      await CandleContract.listItem(name, uri);
      console.log("Item Listed");
    } catch (error) {
      console.error("Error listing item:", error);
    }
  };

  const fetchItems = async () => {
    try {
      console.log("FetchItem Clicked")
      const provider = getProvider();
      const CandleContract = new ethers.Contract(CONTRACT_ADDRESSES.CandleAuction, CandleAuction_ABI, provider);
      const itemCount = await CandleContract.items.length;

      const fetchedItems = [];
      for (let i = 0; i < itemCount; i++) {
        const item = await CandleContract.items(i);
        if (item.itemName === name && item.itemURI === uri) {
          fetchedItems.push({
            itemId: item.itemId.toString(),
            itemName: item.itemName,
            itemURI: item.itemURI,
          });
        }
      }
      setItems(fetchedItems);
      console.log("Items Listed Recently Fetched");
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">List New Item</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-2 w-48 m-9"
        placeholder="Item Name"
      />
      <input
        type="text"
        value={uri}
        onChange={(e) => setUri(e.target.value)}
        className="border p-2 mb-2 w-48 m-9"
        placeholder="Item URI"
      />
      <button className="bg-blue-500 text-white px-4 py-2" onClick={listItem}>List Item</button>

      <h3 className="text-xl font-bold mt-4">On chain Events</h3>
      <ul className="mt-2">
        {events.map((event, index) => (
          <li key={index} className="border p-2 mb-2">
            <p>Item ID: {event.itemId}</p>
            <p>Item Name: {event.itemName}</p>
            <p>Item URI: {event.itemURI}</p>
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-bold mt-4">Fetch Items</h3>
      <button className="bg-green-500 text-white px-4 py-2 mb-4" onClick={fetchItems}>Fetch Recently Listed Item</button>
      <ul className="mt-2">
        {items.map((item, index) => (
          <li key={index} className="border p-2 mb-2">
            <p>Item ID: {item.itemId}</p>
            <p>Item Name: {item.itemName}</p>
            <p>Item URI: {item.itemURI}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListNewItem;
