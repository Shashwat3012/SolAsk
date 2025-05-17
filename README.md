# SolAsk

SolAsk is a developer-first SDK designed for natural language search of Solana dApps. It provides tools and utilities to interact with Solana blockchain data and integrates with LLMs (Large Language Models) for natural language processing.

## Features

- **Solana Integration**: Interact with Solana blockchain data using the SDK.
- **Natural Language Processing**: Leverage LLMs for natural language queries.
- **Developer-Friendly**: Includes utilities and core logic for easy integration into your projects.

## Our SDKs
We have developed 2 SDKs for helping developers to query complex blockchain data either through text or by voice:
1. [solask-sdk](https://github.com/Shashwat3012/SolAsk/blob/main/README.md#solask-sdk)
2. [solask-voice-sdk](https://github.com/Shashwat3012/SolAsk/blob/main/README.md#solask-voice-sdk)

## solask-sdk


The `solask-sdk` text module allows you to query Solana blockchain data using plain natural language inputs and get structured responses.


### 📦 Installation


```bash
npm install solask-sdk
```


### ✨ Usage


```typescript
import { ask } from 'solask-sdk';


async function query() {
  const result = await ask("What is the current SOL price?");
  console.log(result);
};


query();
```


### 🔧 Using it in React Vite App
```typescript
import { useState } from "react";
import { ask } from "solask-sdk";


const SolaskTextDemo = () => {
  const [text, setText] = useState("");
  const [response, setResponse] = useState<string | null>(null);
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
    <div>
      <h2>Solask SDK - Text Input Demo</h2>
      <input
        type="text"
        placeholder="Ask something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleAsk} disabled={loading}>
        {loading ? "Loading..." : "Submit"}
      </button>


      {response && (
        <div>
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};


export default SolaskTextDemo;
```


### 🌐 Examples


```typescript
await ask("How many NFTs are minted today?");
await ask("List top 5 tokens on Solana by volume");
```


### 🧠 How does it work?
This module internally uses:
- Natural language parsing (LLM backed)
- Indexed Solana data endpoints
- Entity detection & aggregation logic



## solask-voice-sdk
The `solask-voice-sdk` module allows users to speak their queries instead of typing, converting voice into text and querying Solana blockchain data in real-time.


### 📦 Installation
```bash
npm install solask-voice-sdk
```


### ✨ Usage in React Vite app
```typescript
import { useState } from "react";
import VoiceButton from "solask-voice-sdk";


interface BackendResponse {
  answer: string;
  transcription?: string;
}


const SolaskVoiceDemo = () => {
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");


  const handleVoiceResult = (data: BackendResponse, transcription?: string) => {
    if (transcription) setTranscript(transcription);
    if (data?.answer) setResponse(data.answer);
    console.log("Voice Result:", data);
  };


  return (
    <div>
      <h2>Solask Voice SDK Demo</h2>
      <VoiceButton onResult={handleVoiceResult} />


      {transcript && (
        <div>
          <strong>Transcription:</strong>
          <p>{transcript}</p>
        </div>
      )}


      {response && (
        <div>
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};


export default SolaskVoiceDemo;
```


### 🧠 How does it work?
- Uses browser's speech-to-text engine.
- Extracts query intent.
- Fetches and formats the relevant data from Solana.

