// src/App.js
import React from "react";
import ItemList from "./components/ItemList";
import ListNewItem from "./components/ListNewItem";

function App() {
  return (
    <div className="App">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-3xl">NFT Auction</h1>
      </header>
      <main className="p-4">
        <ListNewItem />
        <ItemList />
      </main>
    </div>
  );
}

export default App;
