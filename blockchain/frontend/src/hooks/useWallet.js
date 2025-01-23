import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { abi as contractABI } from "../../../artifacts/contracts/OnlineVoting.sol/OnlineVoting.json";

const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

export default function useWallet() {
  const [currentUserAddress, setCurrentUserAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    // Check if ethereum object exists (MetaMask or similar wallet)
    if (window.ethereum) {
      const ethereumProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethereumProvider);
    }

    connectWallet();
  }, []);

  useEffect(() => {
    if (provider) {
      initContract();
    }
  }, [provider]);

  const initContract = async () => {
    const userSigner = await provider.getSigner();
    console.log({ userSigner });

    const connectedContract = new ethers.Contract(
      contractAddress,
      contractABI,
      userSigner
    );

    console.log({ connectedContract });

    setContract(connectedContract);
  };

  const connectWallet = async () => {
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Set the first account
      setCurrentUserAddress(accounts[0]);
    } catch (error) {
      console.error("Connection failed", error);
      throw error;
    }
  };

  const executeContractFunction = async (functionName, ...args) => {
    if (contract) {
      try {
        const tx = await contract[functionName](...args);
        console.log("Transaction sent:", tx);
        // await tx.wait();
        console.log("Transaction confirmed:", tx);
        return tx;
      } catch (error) {
        console.error("Failed to execute contract function:", error);
        throw error;
      }
    } else {
      console.error("Contract is not connected");
    }
  };

  //   console.log({
  //     provider,
  //     currentUserAddress,
  //   });

  return {
    currentUserAddress,
    provider,
    executeContractFunction,
  };
}
