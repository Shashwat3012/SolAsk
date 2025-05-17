"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSolDomain = resolveSolDomain;
exports.getSolBalance = getSolBalance;
exports.handleQuery = handleQuery;
const web3_js_1 = require("@solana/web3.js");
const spl_name_service_1 = require("@bonfida/spl-name-service");
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
(0, dotenv_1.configDotenv)({ path: path_1.default.resolve(__dirname, "../../.env") });
// console.log(`QUICKNODE API KEY: ${process.env.QUICKNODE_RPC_ENDPOINT}`);
const RPC_ENDPOINT = process.env.QUICKNODE_RPC_ENDPOINT;
const connection = new web3_js_1.Connection(RPC_ENDPOINT, "confirmed");
// Resolve a .sol domain to a Solana wallet address
async function resolveSolDomain(domain) {
    try {
        const { pubkey } = await (0, spl_name_service_1.getDomainKey)(domain);
        const { registry } = await spl_name_service_1.NameRegistryState.retrieve(connection, pubkey);
        return new web3_js_1.PublicKey(registry.owner);
    }
    catch (error) {
        console.error("Error resolving domain ${domain}:", error);
        return null;
    }
}
// Fetch SOL balance of a given public key
async function getSolBalance(publicKey) {
    const lamports = await connection.getBalance(publicKey);
    return lamports / 1e9; // Convert lamports to SOL
}
// Handle natural language query for balance of .sol domain
async function handleQuery(input) {
    const match = input.match(/balance of (.+.sol)/i);
    if (!match)
        return { error: 'No .sol domain found in query.' };
    const domain = match[1];
    const pubkey = await resolveSolDomain(domain);
    if (!pubkey)
        return { error: `Unable to resolve domain: ${domain}` };
    const balance = await getSolBalance(pubkey);
    return {
        domain,
        pubkey: pubkey.toBase58(),
        balance,
        summary: `${domain} holds ${balance.toFixed(4)} SOL`
    };
}
