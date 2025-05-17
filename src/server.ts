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
        <title>SolAsk SDK</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 2rem;
            background: #f9f9f9;
            color: #333;
            line-height: 1.6;
          }
          h1, h2, h3 {
            color: #222;
          }
          pre {
            background: #f0f0f0;
            padding: 1em;
            overflow-x: auto;
            border-left: 4px solid #007acc;
          }
          code {
            font-family: monospace;
            background: #eee;
            padding: 0.2em 0.4em;
            border-radius: 3px;
          }
          a {
            color: #007acc;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <h1>SolAsk</h1>
        <p>
          SolAsk is a developer-first SDK designed for natural language search of Solana dApps.
          It provides tools and utilities to interact with Solana blockchain data and integrates with
          LLMs (Large Language Models) for natural language processing.
        </p>

        <h2>Features</h2>
        <ul>
          <li><strong>Solana Integration</strong>: Interact with Solana blockchain data using the SDK.</li>
          <li><strong>Natural Language Processing</strong>: Leverage LLMs for natural language queries.</li>
          <li><strong>Developer-Friendly</strong>: Includes utilities and core logic for easy integration into your projects.</li>
        </ul>

        <h2>Our SDKs</h2>
        <p>We have developed 2 SDKs to help developers query complex blockchain data through text or voice:</p>
        <ol>
          <li><a href="https://github.com/Shashwat3012/SolAsk/blob/main/README.md#solask-sdk" target="_blank">solask-sdk</a></li>
          <li><a href="https://github.com/Shashwat3012/SolAsk/blob/main/README.md#solask-voice-sdk" target="_blank">solask-voice-sdk</a></li>
        </ol>

        <h2>solask-sdk</h2>
        <p>The <code>solask-sdk</code> text module allows you to query Solana blockchain data using plain natural language inputs and get structured responses.</p>

        <h3>📦 Installation</h3>
        <pre><code>npm install solask-sdk</code></pre>

        <h3>✨ Usage</h3>
        <pre><code>import { ask } from 'solask-sdk';

async function query() {
  const result = await ask("What is the current SOL price?");
  console.log(result);
}

query();</code></pre>

        <h3>🔧 Using it in React Vite App</h3>
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
      &lt;input type="text" value={text} onChange={(e) => setText(e.target.value)} /&gt;
      &lt;button onClick={handleAsk}&gt;Submit&lt;/button&gt;
      {response && &lt;p&gt;{response}&lt;/p&gt;}
    &lt;/div&gt;
  );
};

export default SolaskTextDemo;</code></pre>

        <h3>🌐 Examples</h3>
        <pre><code>await ask("How many NFTs are minted today?");
await ask("List top 5 tokens on Solana by volume");</code></pre>

        <h3>🧠 How does it work?</h3>
        <ul>
          <li>Natural language parsing (LLM backed)</li>
          <li>Indexed Solana data endpoints</li>
          <li>Entity detection & aggregation logic</li>
        </ul>

        <h2>solask-voice-sdk</h2>
        <p>The <code>solask-voice-sdk</code> module allows users to speak their queries instead of typing, converting voice into text and querying Solana blockchain data in real-time.</p>

        <h3>📦 Installation</h3>
        <pre><code>npm install solask-voice-sdk</code></pre>

        <h3>✨ Usage in React Vite app</h3>
        <pre><code>import { useState } from "react";
import VoiceButton from "solask-voice-sdk";

const SolaskVoiceDemo = () => {
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");

  const handleVoiceResult = (data, transcription) => {
    if (transcription) setTranscript(transcription);
    if (data?.answer) setResponse(data.answer);
    console.log("Voice Result:", data);
  };

  return (
    &lt;div&gt;
      &lt;h2&gt;Solask Voice SDK Demo&lt;/h2&gt;
      &lt;VoiceButton onResult={handleVoiceResult} /&gt;

      {transcript && (
        &lt;div&gt;
          &lt;strong&gt;Transcription:&lt;/strong&gt;
          &lt;p&gt;{transcript}&lt;/p&gt;
        &lt;/div&gt;
      )}

      {response && (
        &lt;div&gt;
          &lt;strong&gt;Response:&lt;/strong&gt;
          &lt;p&gt;{response}&lt;/p&gt;
        &lt;/div&gt;
      )}
    &lt;/div&gt;
  );
};

export default SolaskVoiceDemo;</code></pre>

        <h3>🧠 How does it work?</h3>
        <ul>
          <li>Uses browser's speech-to-text engine.</li>
          <li>Extracts query intent.</li>
          <li>Fetches and formats the relevant data from Solana.</li>
        </ul>
      </body>
    </html>
  `);
});


app.listen(port, () => {
  console.log(`🚀 Solask server running at http://localhost:${port}`);
});
