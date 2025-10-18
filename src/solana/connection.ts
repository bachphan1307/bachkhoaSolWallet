import { clusterApiUrl, Connection, type Commitment } from '@solana/web3.js';

const DEFAULT_ENDPOINT = 'http://127.0.0.1:8899';
const DEFAULT_COMMITMENT: Commitment = 'confirmed';

let cachedConnection: Connection | null = null;

export const getConnection = (endpoint: string = DEFAULT_ENDPOINT) => {
  if (!cachedConnection || cachedConnection.rpcEndpoint !== endpoint) {
    cachedConnection = new Connection(endpoint, DEFAULT_COMMITMENT);
  }
  return cachedConnection;
};

export const getDevnetFallback = () => clusterApiUrl('devnet');
