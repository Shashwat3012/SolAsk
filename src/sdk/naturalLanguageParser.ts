// src/sdk/naturalLanguageParser.ts

export function parseUserQuery(query: string): {
  action: string;
  address?: string;
} {
  const lowerCaseQuery = query.toLowerCase();

  if (lowerCaseQuery.includes("balance")) {
    const addressMatch = query.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/); // Solana public address regex
    return {
      action: "getBalance",
      address: addressMatch ? addressMatch[0] : undefined,
    };
  }

  return { action: "unknown" };
}
