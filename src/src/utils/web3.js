// src/utils/web3.js
import { BrowserProvider, Contract } from "ethers";

export const getProvider = () => {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new BrowserProvider(window.ethereum);
    return provider;
  } else {
    throw new Error("MetaMask is not installed");
  }
};

export const getSigner = async () => {
  const provider = getProvider();
  try {
    await provider.send("eth_requestAccounts", []);
  } catch (error) {
    if (error.code === -32002) {
      throw new Error("MetaMask request already pending. Please check MetaMask.");
    } else {
      throw error;
    }
  }
  return provider.getSigner();
};

export const getContract = async (address, abi) => {
  const signer = await getSigner();
  return new Contract(address, abi, signer);
};
