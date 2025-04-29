// // src/sdk/naturalLanguageParser.ts

// export function parseUserQuery(query: string): {
//   action: string;
//   address?: string;
// } {
//   const lowerCaseQuery = query.toLowerCase();

//   if (lowerCaseQuery.includes("balance")) {
//     const addressMatch = query.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/); // Solana public address regex
//     return {
//       action: "getBalance",
//       address: addressMatch ? addressMatch[0] : undefined,
//     };
//   }

//   return { action: "unknown" };
// }




// import {OpenAI} from "openai";

// const openai = new OpenAI({
//   apiKey: `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`,
// });

// // console.log(`API Key: ${apiKey}`);

// export async function parseUserQuery(userQuery: string){
//   try {
//     const systemPrompt = `
// You are a Solana blockchain expert assistant.

// Given a user's natural language query, identify the correct Solana RPC method they intend to call.

// The allowed actions are:
// [getBalance, getBlock, getBlockHeight, getBlockProduction, getEpochInfo, getEpochSchedule, getFirstAvailableBlock, getGenesisHash, getHealth, getIdentity, getInflationRate, getLatestBlockhash, getLeaderSchedule, getMaxRetransmitSlot, getMaxShredInsertSlot, getMinimumBalanceForRentExemption, getSlot, getSupply, getTokenAccountBalance, getTransactionCount, getVersion, getVoteAccounts]

// Respond ONLY in valid JSON format like:

// {
//   "action": "ACTION_NAME",
//   "address": "OPTIONAL_IF_NEEDED",
//   "blockNumber": "OPTIONAL_IF_NEEDED",
//   "dataSize": "OPTIONAL_IF_NEEDED"
// }

// - If the query needs an address (e.g., balance), extract it.
// - If the query needs a block number (e.g., getBlock), extract it.
// - If not needed, omit optional fields.
// - DO NOT add any explanations or text, just the JSON object.

// If you cannot understand the query or it's unrelated to Solana, respond with:

// {
//   "action": "unknown"
// }
// `;

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo", // you can also use "gpt-3.5-turbo" for cheaper cost
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userQuery },
//       ],
//       temperature: 0, // keep it 0 for max consistency
//     });

//     const content = response.choices[0]?.message?.content;

//     if (!content) {
//       throw new Error("Empty response from LLM.");
//     }

//     const parsed = JSON.parse(content);
//     return parsed;
//   } catch (error) {
//     console.error("Error parsing user query:", error);
//     throw new Error("Failed to process user query.");
//   }
// }






import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);
const genAI = new GoogleGenerativeAI("AIzaSyCkA0oz8RRe8OpB7bro6Xlg3vTZ7zp3yGI");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using gemini-pro as gemini-flash is not directly exposed yet

// async function listAvailableModels() {
//   try {
//     const models = await model.listModels();
//     console.log("Available models:", models);
//   } catch (error) {
//     console.error("Error fetching available models:", error);
//   }
// }

// listAvailableModels();

export async function parseUserQuery(userQuery: string) {
  try {
    const systemPrompt = `
You are a Solana blockchain expert assistant.

Given a user's natural language query, identify the correct Solana RPC method they intend to call.
This is the User Query that you have to understand and solve: ${userQuery}

The allowed actions are:
[getBalance, getBlock, getBlockHeight, getBlockProduction, getEpochInfo, getEpochSchedule, getFirstAvailableBlock, getGenesisHash, getHealth, getIdentity, getInflationRate, getLatestBlockhash, getLeaderSchedule, getMaxRetransmitSlot, getMaxShredInsertSlot, getMinimumBalanceForRentExemption, getSlot, getSupply, getTokenAccountBalance, getTransactionCount, getVersion, getVoteAccounts]

Respond ONLY in valid JSON format like:

{
  "action": "ACTION_NAME",
  "address": "OPTIONAL_IF_NEEDED",
  "blockNumber": "OPTIONAL_IF_NEEDED",
  "dataSize": "OPTIONAL_IF_NEEDED"
}

- If the query needs an address (e.g., balance), extract it.
- If the query needs a block number (e.g., getBlock), extract it.
- If not needed, omit optional fields.
- DO NOT add any explanations or text, just the JSON object.

If you cannot understand the query or it's unrelated to Solana, respond with:

{
  "action": "unknown"
}
`;

    // const result = await model.generateContent([
    //   contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
    // ]);

    const result = await model.generateContent(systemPrompt);


    const response = await result.response;
    const content = response.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("Content: ", content);
    if (!content) {
      throw new Error("Empty response from Gemini.");
    }

    let text = content;

    if (!text || typeof text !== "string") {
      throw new Error("Invalid response from Gemini.");
    }

    // Clean up the text
    text = text.trim();
    if (text.startsWith("```")) {
      text = text.replace(/```(?:json)?/g, "").trim();
      text = text.replace(/```/g, "").trim();
    }

    const parsed = JSON.parse(text);
    console.log(parsed);
    return parsed;
  } catch (error) {
    console.error("Error parsing user query:", error);
    throw new Error("Failed to process user query with Gemini.");
  }
}
