// src/solana/solanaService.ts

import axios from "axios";

const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com"; // you can replace with your own node if needed

// export async function getBalance(address: string): Promise<number> {
//   try {
//     const response = await axios.post(SOLANA_RPC_URL, {
//       jsonrpc: "2.0",
//       id: 1,
//       method: "getBalance",
//       params: [address],
//     });

//     return response.data.result.value;
//   } catch (error) {
//     console.error("Error fetching balance:", error);
//     throw new Error("Failed to fetch balance from Solana.");
//   }
// }


async function makeRpcRequest(method: string, params: any[] = []) {
  try {
    const response = await fetch(SOLANA_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`RPC Error: ${data.error.message || "Unknown error"}`);
    }

    return data.result;
  } catch (error: any) {
    console.error(`[makeRpcRequest] Error calling ${method}:`, error.message);
    throw error; // Re-throw so the main app can handle it
  }
}

export async function getBalance(address: string) {
  return makeRpcRequest("getBalance", [address]);
}

export async function getAccountInfo(address: string) {
  return makeRpcRequest("getAccountInfo", [address]);
}

export async function getRecentTransactions(address: string) {
  return makeRpcRequest("getConfirmedSignaturesForAddress2", [
    address,
    { limit: 10 },
  ]);
}

export async function getTransaction(signature: string) {
  return makeRpcRequest("getTransaction", [signature]);
}

export async function getTokenAccounts(address: string) {
  return makeRpcRequest("getTokenAccountsByOwner", [
    address,
    { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
  ]);
}

export async function getLatestBlockhash() {
  return makeRpcRequest("getLatestBlockhash");
}

export async function getSupply() {
  return makeRpcRequest("getSupply");
}

export async function getEpochInfo() {
  return makeRpcRequest("getEpochInfo");
}

export async function getProgramAccounts(programId: string) {
  return makeRpcRequest("getProgramAccounts", [programId]);
}



// added manually by shashwat
export async function getBlock(blockNumber: number) {
  return makeRpcRequest("getBlock", [blockNumber]);
}

export async function getBlockHeight() {
  return makeRpcRequest("getBlockHeight");
}

export async function getBlockProduction() {
  return makeRpcRequest("getBlockProduction");
}

export async function getEpochSchedule() {
  return await makeRpcRequest("getEpochSchedule");
}

export async function getFirstAvailableBlock() {
  return await makeRpcRequest("getFirstAvailableBlock");
}

export async function getGenesisHash() {
  return await makeRpcRequest("getGenesisHash");
}

export async function getHealth(){
  return await makeRpcRequest("getHealth");
}

export async function getIdentity() {
  return await makeRpcRequest("getIdentity");
}

export async function getInflationRate() {
  return await makeRpcRequest("getInflationRate");
}


export async function getLeaderSchedule() {
  return await makeRpcRequest("getLeaderSchedule");
}

export async function getMaxRetransmitSlot(){
  return await makeRpcRequest("getMaxRetransmitSlot");
}

export async function getMaxShredInsertSlot(){
  return await makeRpcRequest("getMaxShredInsertSlot");
}

// export async function getMinimumBalanceForRentExemption(
//   dataSize: number
// ): Promise<number> {
//   return await connection.getMinimumBalanceForRentExemption(dataSize);
// }

export async function getSlot() {
  return await makeRpcRequest("getSlot");
}


// export async function getTokenAccountBalance(
//   tokenAccountAddress: string
// ): Promise<any> {
//   const publicKey = new PublicKey(tokenAccountAddress);
//   return await connection.getTokenAccountBalance(publicKey);
// }

export async function getTransactionCount() {
  return await makeRpcRequest("getTransactionCount");
}

export async function getVersion() {
  return await makeRpcRequest("getVersion");
}

export async function getVoteAccounts() {
  return await makeRpcRequest("getVoteAccounts");
}
