"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solaskQuery = solaskQuery;
const naturalLanguageParser_1 = require("./naturalLanguageParser");
const solanaNames_1 = require("../solana/solanaNames");
const solanaService_1 = require("../solana/solanaService");
async function solaskQuery(query) {
    // before sending to llm, checking for use of SNS & resolving that here itself.
    const newQuery = (0, solanaNames_1.handleQuery)(query);
    console.log("newquery: ", newQuery);
    query += ` where ${(await newQuery).pubkey} is the address of ${(await newQuery).domain}`;
    console.log("Consoling the query before sending it to llm: ", query);
    // sending this to llm
    const parsed = await (0, naturalLanguageParser_1.parseUserQuery)(query);
    try {
        switch (parsed.action) {
            case "getBalance":
                if (!parsed.address)
                    throw new Error("Address missing for balance query.");
                const balance = await (0, solanaService_1.getBalance)(parsed.address);
                return `The balance of ${parsed.address} is ${balance.value} lamports.`;
            case "getBlockHeight":
                const blockHeight = await (0, solanaService_1.getBlockHeight)();
                return `Current block height: ${blockHeight}`;
            case "getBlockProduction":
                const blockProduction = await (0, solanaService_1.getBlockProduction)();
                return `Block Production Info: ${JSON.stringify(blockProduction)}`;
            case "getEpochInfo":
                const epochInfo = await (0, solanaService_1.getEpochInfo)();
                return `Epoch Info: ${JSON.stringify(epochInfo)}`;
            case "getEpochSchedule":
                const epochSchedule = await (0, solanaService_1.getEpochSchedule)();
                return `Epoch Schedule: ${JSON.stringify(epochSchedule)}`;
            case "getFirstAvailableBlock":
                const firstAvailableBlock = await (0, solanaService_1.getFirstAvailableBlock)();
                return `First Available Block: ${firstAvailableBlock}`;
            case "getGenesisHash":
                const genesisHash = await (0, solanaService_1.getGenesisHash)();
                return `Genesis Hash: ${genesisHash}`;
            case "getHealth":
                const health = await (0, solanaService_1.getHealth)();
                return `Node Health: ${health}`;
            case "getIdentity":
                const identity = await (0, solanaService_1.getIdentity)();
                return `Node Identity: ${JSON.stringify(identity)}`;
            case "getInflationRate":
                const inflationRate = await (0, solanaService_1.getInflationRate)();
                return `Inflation Rate: ${JSON.stringify(inflationRate)}`;
            case "getLatestBlockhash":
                const latestBlockhash = await (0, solanaService_1.getLatestBlockhash)();
                return `Latest Blockhash: ${JSON.stringify(latestBlockhash)}`;
            case "getLeaderSchedule":
                const leaderSchedule = await (0, solanaService_1.getLeaderSchedule)();
                return `Leader Schedule: ${JSON.stringify(leaderSchedule)}`;
            case "getMaxRetransmitSlot":
                const maxRetransmitSlot = await (0, solanaService_1.getMaxRetransmitSlot)();
                return `Max Retransmit Slot: ${maxRetransmitSlot}`;
            case "getMaxShredInsertSlot":
                const maxShredInsertSlot = await (0, solanaService_1.getMaxShredInsertSlot)();
                return `Max Shred Insert Slot: ${maxShredInsertSlot}`;
            case "getSlot":
                const slot = await (0, solanaService_1.getSlot)();
                return `Current Slot: ${slot}`;
            case "getSupply":
                const supply = await (0, solanaService_1.getSupply)();
                return `Supply Info: ${JSON.stringify(supply)}`;
            case "getTokenAccountBalance":
                if (!parsed.tokenAccount)
                    throw new Error("Token account missing for balance query.");
                const tokenBalance = await (0, solanaService_1.getTokenAccountBalance)(parsed.tokenAccount);
                return `Token Account Balance: ${JSON.stringify(tokenBalance)}`;
            case "getTransactionCount":
                const transactionCount = await (0, solanaService_1.getTransactionCount)();
                return `Transaction Count: ${transactionCount}`;
            case "getVersion":
                const version = await (0, solanaService_1.getVersion)();
                return `Cluster Version: ${JSON.stringify(version)}`;
            case "getVoteAccounts":
                const voteAccounts = await (0, solanaService_1.getVoteAccounts)();
                return `Vote Accounts: ${JSON.stringify(voteAccounts)}`;
            default:
                return "Sorry, I could not understand your request.";
        }
    }
    catch (error) {
        console.error(`[solaskQuery] Error handling query: ${error.message}`);
        return `An error occurred: ${error.message}`;
    }
}
