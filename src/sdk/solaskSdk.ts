// src/sdk/solaskSdk.ts

import { parseUserQuery } from "./naturalLanguageParser";
import { getBalance } from "../solana/solanaService";

export async function solaskQuery(query: string): Promise<string> {
  const parsed = parseUserQuery(query);

  if (parsed.action === "getBalance" && parsed.address) {
    const balance = await getBalance(parsed.address);
    return `The balance of ${parsed.address} is ${balance} lamports.`;
  }

  return "Sorry, I could not understand your request.";
}
