import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { getDomainKey, NameRegistryState } from '@bonfida/spl-name-service';

const connection = new Connection(
  "https://crimson-long-market.solana-mainnet.quiknode.pro/167d58435b27d395750ff416301e2242f15316bb/",
  "confirmed"
);

// Resolve a .sol domain to a Solana wallet address
export async function resolveSolDomain(domain: string): Promise<PublicKey | null> {
    try {
        const { pubkey } = await getDomainKey(domain);
        const { registry } = await NameRegistryState.retrieve(connection, pubkey);
        return new PublicKey(registry.owner);
    } catch (error) {
        console.error("Error resolving domain ${domain}:", error);
        return null;
    }
}

// Fetch SOL balance of a given public key
export async function getSolBalance(publicKey: PublicKey): Promise<number> {
    const lamports = await connection.getBalance(publicKey);
    return lamports / 1e9; // Convert lamports to SOL
}

// Handle natural language query for balance of .sol domain
export async function handleQuery(input: string) {
    const match = input.match(/balance of (.+.sol)/i);
    if (!match) return { error: 'No .sol domain found in query.' };

    const domain = match[1];
    const pubkey = await resolveSolDomain(domain);

    // if (!pubkey) return {`Error: Unable to resolve domain: ${domain}`};
    if (!pubkey) return { error: `Unable to resolve domain: ${domain}`};

    // if (!pubkey) {
    //     return "Error: Unable to resolve domain: ${domain}";
    // }

    const balance = await getSolBalance(pubkey);
    return {
        domain,
        pubkey: pubkey.toBase58(),
        balance,
        summary: `${domain} holds ${balance.toFixed(4)} SOL`
    };
}