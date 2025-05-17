import express from "express";
import { solaskQuery } from "./sdk/solaskSdk";
import { handleQuery } from "./solana/solanaNames";
import cors from "cors";
import { configDotenv } from "dotenv";
import path from "path";

configDotenv({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port = 3001;

app.use(cors());

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

app.post("/getSNS", async (req: any, res: any) => {
  const userInput = req.body.query;

  if (!userInput) {
    return res.status(400).json({ error: "Missing 'query' in request body" });
  }

  try {
    const answer = await handleQuery(userInput);
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>solask-sdk API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
          }
          pre {
            background: #eee;
            padding: 1em;
            overflow-x: auto;
          }
          h1, h2, h3 {
            color: #222;
          }
        </style>
      </head>
      <body>
        <h1>solask-sdk</h1>
        <p>The <code>solask-sdk</code> text module allows you to query Solana blockchain data using plain natural language inputs and get structured responses.</p>

        <h2>📦 Installation</h2>
        <pre><code>npm install solask-sdk</code></pre>

        <h2>✨ Usage</h2>
        <pre><code>import { ask } from 'solask-sdk';

async function query() {
  const result = await ask("What is the current SOL price?");
  console.log(result);
}

query();</code></pre>

        <h2>🔧 Using it in React Vite App</h2>
        <pre><code>import { useState } from "react";
import { ask } from "solask-sdk";

const SolaskTextDemo = () => {
  const [text, setText] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!text.trim()) {
      alert("Please enter a question.");
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const answer = await ask(text);
      setResponse(answer);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to get response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    &lt;div&gt;
      &lt;h2&gt;Solask SDK - Text Input Demo&lt;/h2&gt;
      &lt;input
        type="text"
        placeholder="Ask something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      /&gt;
      &lt;button onClick={handleAsk} disabled={loading}&gt;
        {loading ? "Loading..." : "Submit"}
      &lt;/button&gt;

      {response && (
        &lt;div&gt;
          &lt;strong&gt;Response:&lt;/strong&gt;
          &lt;p&gt;{response}&lt;/p&gt;
        &lt;/div&gt;
      )}
    &lt;/div&gt;
  );
};

export default SolaskTextDemo;
</code></pre>

        <h2>🌐 Examples</h2>
        <pre><code>await ask("How many NFTs are minted today?");
await ask("List top 5 tokens on Solana by volume");</code></pre>

        <h2>🧠 How does it work?</h2>
        <ul>
          <li>Natural language parsing (LLM backed)</li>
          <li>Indexed Solana data endpoints</li>
          <li>Entity detection & aggregation logic</li>
        </ul>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`🚀 Solask server running at http://localhost:${port}`);
});
