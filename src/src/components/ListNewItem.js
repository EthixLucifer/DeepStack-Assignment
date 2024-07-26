
import React, { useState } from "react";
import { getContract } from "../utils/web3";
import NFT_ABI from "../abi/NFT.json";
import CandleAuction from "../abi/Auction.json"

const CandleAuctionAddress = "0x65D16498c3fEA88cc9dD7Fb5297719A17fB56245";

const ListNewItem = () => {
  const [name, setName] = useState("");
  const [uri, setUri] = useState("");

  const listItem = async () => {
    const CandleContract = getContract(CandleAuctionAddress, CandleAuction);
    await CandleContract.createNFT(name, uri);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">List New Item</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-2 w-full"
        placeholder="Item Name"
      />
      <input
        type="text"
        value={uri}
        onChange={(e) => setUri(e.target.value)}
        className="border p-2 mb-2 w-full"
        placeholder="Item URI"
      />
      <button className="bg-blue-500 text-white px-4 py-2" onClick={listItem}>List Item</button>
    </div>
  );
};

export default ListNewItem;
