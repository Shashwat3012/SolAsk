import { parseUserQuery } from "./naturalLanguageParser";
import { handleQuery } from "../solana/solanaNames";

import { 
  getBalance,
  getBlockHeight,
  getBlockProduction,
  getEpochInfo,
  getEpochSchedule,
  getFirstAvailableBlock,
  getGenesisHash,
  getHealth,
  getIdentity,
  getInflationRate,
  getLatestBlockhash,
  getLeaderSchedule,
  getMaxRetransmitSlot,
  getMaxShredInsertSlot,
  getSlot,
  getSupply,
  getTokenAccountBalance,
  getTransactionCount,
  getVersion,
  getVoteAccounts
} from "../solana/solanaService";

export async function solaskQuery(query: string): Promise<string> {
  // before sending to llm, checking for use of SNS & resolving that here itself.
  const newQuery = handleQuery(query);
  console.log("newquery: ", newQuery)

  query += ` where ${(await newQuery).pubkey} is the address of ${
    (await newQuery).domain
  }`;

  console.log("Consoling the query before sending it to llm: ", query);
  // sending this to llm
  const parsed = await parseUserQuery(query);

  try {
    switch (parsed.action) {
      case "getBalance":
        if (!parsed.address) throw new Error("Address missing for balance query.");
        const balance = await getBalance(parsed.address);
        return `The balance of ${parsed.address} is ${balance.value} lamports.`;

      case "getBlockHeight":
        const blockHeight = await getBlockHeight();
        return `Current block height: ${blockHeight}`;

      case "getBlockProduction":
        const blockProduction = await getBlockProduction();
        return `Block Production Info: ${JSON.stringify(blockProduction)}`;

      case "getEpochInfo":
        const epochInfo = await getEpochInfo();
        return `Epoch Info: ${JSON.stringify(epochInfo)}`;

      case "getEpochSchedule":
        const epochSchedule = await getEpochSchedule();
        return `Epoch Schedule: ${JSON.stringify(epochSchedule)}`;

      case "getFirstAvailableBlock":
        const firstAvailableBlock = await getFirstAvailableBlock();
        return `First Available Block: ${firstAvailableBlock}`;

      case "getGenesisHash":
        const genesisHash = await getGenesisHash();
        return `Genesis Hash: ${genesisHash}`;

      case "getHealth":
        const health = await getHealth();
        return `Node Health: ${health}`;

      case "getIdentity":
        const identity = await getIdentity();
        return `Node Identity: ${JSON.stringify(identity)}`;

      case "getInflationRate":
        const inflationRate = await getInflationRate();
        return `Inflation Rate: ${JSON.stringify(inflationRate)}`;

      case "getLatestBlockhash":
        const latestBlockhash = await getLatestBlockhash();
        return `Latest Blockhash: ${JSON.stringify(latestBlockhash)}`;

      case "getLeaderSchedule":
        const leaderSchedule = await getLeaderSchedule();
        return `Leader Schedule: ${JSON.stringify(leaderSchedule)}`;

      case "getMaxRetransmitSlot":
        const maxRetransmitSlot = await getMaxRetransmitSlot();
        return `Max Retransmit Slot: ${maxRetransmitSlot}`;

      case "getMaxShredInsertSlot":
        const maxShredInsertSlot = await getMaxShredInsertSlot();
        return `Max Shred Insert Slot: ${maxShredInsertSlot}`;

      case "getSlot":
        const slot = await getSlot();
        return `Current Slot: ${slot}`;

      case "getSupply":
        const supply = await getSupply();
        return `Supply Info: ${JSON.stringify(supply)}`;

      case "getTokenAccountBalance":
        if (!parsed.tokenAccount) throw new Error("Token account missing for balance query.");
        const tokenBalance = await getTokenAccountBalance(parsed.tokenAccount);
        return `Token Account Balance: ${JSON.stringify(tokenBalance)}`;

      case "getTransactionCount":
        const transactionCount = await getTransactionCount();
        return `Transaction Count: ${transactionCount}`;

      case "getVersion":
        const version = await getVersion();
        return `Cluster Version: ${JSON.stringify(version)}`;

      case "getVoteAccounts":
        const voteAccounts = await getVoteAccounts();
        return `Vote Accounts: ${JSON.stringify(voteAccounts)}`;

      default:
        return "Sorry, I could not understand your request.";
    }
  } catch (error: any) {
    console.error(`[solaskQuery] Error handling query: ${error.message}`);
    return `An error occurred: ${error.message}`;
  }
}