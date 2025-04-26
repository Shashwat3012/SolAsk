// src/solana/solanaService.ts

import axios from "axios";

const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com"; // you can replace with your own node if needed

export async function getBalance(address: string): Promise<number> {
  try {
    const response = await axios.post(SOLANA_RPC_URL, {
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [address],
    });

    return response.data.result.value;
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw new Error("Failed to fetch balance from Solana.");
  }
}
