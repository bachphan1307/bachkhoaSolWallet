import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

let cachedConnection: Connection | null = null;

export function getConnection(): Connection {
  if (!cachedConnection) {
    cachedConnection = new Connection('http://127.0.0.1:8899', 'confirmed');
  }

  return cachedConnection;
}

export async function airdrop(pubkey: PublicKey, sol: number): Promise<string> {
  const connection = getConnection();
  const lamports = Math.round(sol * LAMPORTS_PER_SOL);
  const signature = await connection.requestAirdrop(pubkey, lamports);
  const latestBlockhash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    signature,
    ...latestBlockhash,
  }, 'confirmed');

  return signature;
}

export async function getBalance(pubkey: PublicKey): Promise<number> {
  const connection = getConnection();
  const lamports = await connection.getBalance(pubkey, 'confirmed');

  return lamports / LAMPORTS_PER_SOL;
}

export async function sendSol(from: Keypair, to: string, amountSol: number): Promise<string> {
  const connection = getConnection();
  const lamports = Math.round(amountSol * LAMPORTS_PER_SOL);
  const toPubkey = new PublicKey(to);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey,
      lamports,
    }),
  );

  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [from],
    { commitment: 'confirmed' },
  );

  return signature;
}
