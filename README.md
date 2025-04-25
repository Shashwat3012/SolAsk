# SolAsk

SolAsk is a developer-first SDK designed for natural language search of Solana dApps. It provides tools and utilities to interact with Solana blockchain data and integrates with LLMs (Large Language Models) for natural language processing.

## Features

- **Solana Integration**: Interact with Solana blockchain data using the SDK.
- **Natural Language Processing**: Leverage LLMs for natural language queries.
- **Developer-Friendly**: Includes utilities and core logic for easy integration into your projects.

## Project Structure

SolAsk
├── dist/             # Compiled JavaScript and type definitions
├── src/
│   ├── index.ts        # SDK entry point
│   ├── sdk/            # SDK core logic
│   │   ├── core.ts
│   │   └── utils.ts
│   ├── api/            # API backend
│   │   ├── controllers/
│   │   │   └── query.controller.ts
│   │   ├── routes/
│   │   │   └── query.routes.ts
│   │   └── server.ts
│   ├── llm/            # LLM interaction
│   │   └── llmService.ts
│   ├── solana/         # Solana data interaction
│   │   └── solanaService.ts
│   ├── types/          # Shared types
│   │   └── index.ts
├── .env              # Environment variables (DO NOT COMMIT)
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE


## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v16 or later)
- **npm** (v8 or later)
- **TypeScript** (installed globally or as a dev dependency)

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/susmitasanti/SolAsk.git
   cd SolAsk











![alt text](image.png)