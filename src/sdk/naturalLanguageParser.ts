import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCkA0oz8RRe8OpB7bro6Xlg3vTZ7zp3yGI");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using gemini-pro as gemini-flash is not directly exposed yet

export async function parseUserQuery(userQuery: string) {
  try {
   const systemPrompt = `
You are a parser that converts user queries about the Solana blockchain into a JSON command for a Solana SDK.

Only respond with a JSON object using the following structure:

{
  "action": "<required: one of getBalance, getBlock, getBlockHeight, getBlockProduction, getEpochInfo, getEpochSchedule, getFirstAvailableBlock, getGenesisHash, getHealth, getIdentity, getInflationRate, getLatestBlockhash, getLeaderSchedule, getMaxRetransmitSlot, getMaxShredInsertSlot, getSlot, getSupply, getTokenAccountBalance, getTransactionCount, getVersion, getVoteAccounts>",
  "address": "<optional: Solana address if the action requires one>",
  "tokenAccount": "<optional: token account address if needed>",
  "block": "<optional: block number if needed>",
  "dataSize": "<optional: number, for rent exemption queries>"
}

Do not include any explanations. Just output the JSON.

User Query: """${userQuery}"""
`;


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