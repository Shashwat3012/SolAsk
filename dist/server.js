"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const solaskSdk_1 = require("./sdk/solaskSdk");
const solanaNames_1 = require("./solana/solanaNames");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
(0, dotenv_1.configDotenv)({ path: path_1.default.resolve(__dirname, "../.env") });
const app = (0, express_1.default)();
const port = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/ask", async (req, res) => {
    const userInput = req.body.query;
    if (!userInput) {
        return res.status(400).json({ error: "Missing 'query' in request body" });
    }
    try {
        const answer = await (0, solaskSdk_1.solaskQuery)(userInput);
        res.json({ answer });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.post("/getSNS", async (req, res) => {
    const userInput = req.body.query;
    if (!userInput) {
        return res.status(400).json({ error: "Missing 'query' in request body" });
    }
    try {
        const answer = await (0, solanaNames_1.handleQuery)(userInput);
        res.json({ answer });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.listen(port, () => {
    console.log(`🚀 Solask server running at http://localhost:${port}`);
});
