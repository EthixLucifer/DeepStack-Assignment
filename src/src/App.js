// src/App.js
import React from "react";
import ItemList from "./components/ItemList";
import ListNewItem from "./components/ListNewItem";
import Auction from "./components/Auction";
import WithdrawBid from "./components/withdrawBid";
import EndAuction from "./components/EndAuction";
import GetTimeRemaining from "./components/remainingTime";

function App() {
  return (
    <div className="App">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-3xl">NFT Auction</h1>
      </header>
      <main className="p-4">
        <ListNewItem />
        <ItemList />
        <Auction />
        <GetTimeRemaining />
        <WithdrawBid />
        <EndAuction />
      </main>
    </div>
  );
}

export default App;
