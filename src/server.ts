// SDK Entry point

// src/server.ts

import express from "express";
import { solaskQuery } from "./sdk/solaskSdk";
import { configDotenv } from "dotenv";

configDotenv({ path: "../.env" });

const app = express();
const port = 3000;

app.use(express.json());

app.post("/ask", async (req: any, res: any) => {
  const userInput = req.body.query;

  if (!userInput) {
    return res.status(400).json({ error: "Missing 'query' in request body" });
  }

  try {
    const answer = await solaskQuery(userInput);
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Solask server running at http://localhost:${port}`);
});
