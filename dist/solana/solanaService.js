"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalance = getBalance;
exports.getAccountInfo = getAccountInfo;
exports.getRecentTransactions = getRecentTransactions;
exports.getTransaction = getTransaction;
exports.getTokenAccounts = getTokenAccounts;
exports.getLatestBlockhash = getLatestBlockhash;
exports.getSupply = getSupply;
exports.getEpochInfo = getEpochInfo;
exports.getProgramAccounts = getProgramAccounts;
exports.getBlock = getBlock;
exports.getBlockHeight = getBlockHeight;
exports.getBlockProduction = getBlockProduction;
exports.getEpochSchedule = getEpochSchedule;
exports.getFirstAvailableBlock = getFirstAvailableBlock;
exports.getGenesisHash = getGenesisHash;
exports.getHealth = getHealth;
exports.getIdentity = getIdentity;
exports.getInflationRate = getInflationRate;
exports.getLeaderSchedule = getLeaderSchedule;
exports.getMaxRetransmitSlot = getMaxRetransmitSlot;
exports.getMaxShredInsertSlot = getMaxShredInsertSlot;
exports.getSlot = getSlot;
exports.getTokenAccountBalance = getTokenAccountBalance;
exports.getTransactionCount = getTransactionCount;
exports.getVersion = getVersion;
exports.getVoteAccounts = getVoteAccounts;
const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com";
async function makeRpcRequest(method, params = []) {
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
    }
    catch (error) {
        console.error(`[makeRpcRequest] Error calling ${method}:`, error.message);
        throw error; // Re-throw so the main app can handle it
    }
}
async function getBalance(address) {
    return makeRpcRequest("getBalance", [address]);
}
async function getAccountInfo(address) {
    return makeRpcRequest("getAccountInfo", [address]);
}
async function getRecentTransactions(address) {
    return makeRpcRequest("getConfirmedSignaturesForAddress2", [
        address,
        { limit: 10 },
    ]);
}
async function getTransaction(signature) {
    return makeRpcRequest("getTransaction", [signature]);
}
async function getTokenAccounts(address) {
    return makeRpcRequest("getTokenAccountsByOwner", [
        address,
        { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
    ]);
}
async function getLatestBlockhash() {
    return makeRpcRequest("getLatestBlockhash");
}
async function getSupply() {
    return makeRpcRequest("getSupply");
}
async function getEpochInfo() {
    return makeRpcRequest("getEpochInfo");
}
async function getProgramAccounts(programId) {
    return makeRpcRequest("getProgramAccounts", [programId]);
}
async function getBlock(blockNumber) {
    return makeRpcRequest("getBlock", [blockNumber]);
}
async function getBlockHeight() {
    return makeRpcRequest("getBlockHeight");
}
async function getBlockProduction() {
    return makeRpcRequest("getBlockProduction");
}
async function getEpochSchedule() {
    return await makeRpcRequest("getEpochSchedule");
}
async function getFirstAvailableBlock() {
    return await makeRpcRequest("getFirstAvailableBlock");
}
async function getGenesisHash() {
    return await makeRpcRequest("getGenesisHash");
}
async function getHealth() {
    return await makeRpcRequest("getHealth");
}
async function getIdentity() {
    return await makeRpcRequest("getIdentity");
}
async function getInflationRate() {
    return await makeRpcRequest("getInflationRate");
}
async function getLeaderSchedule() {
    return await makeRpcRequest("getLeaderSchedule");
}
async function getMaxRetransmitSlot() {
    return await makeRpcRequest("getMaxRetransmitSlot");
}
async function getMaxShredInsertSlot() {
    return await makeRpcRequest("getMaxShredInsertSlot");
}
async function getSlot() {
    return await makeRpcRequest("getSlot");
}
async function getTokenAccountBalance(tokenAccountAddress) {
    return makeRpcRequest("getTokenAccountBalance", [tokenAccountAddress]);
}
async function getTransactionCount() {
    return await makeRpcRequest("getTransactionCount");
}
async function getVersion() {
    return await makeRpcRequest("getVersion");
}
async function getVoteAccounts() {
    return await makeRpcRequest("getVoteAccounts");
}
