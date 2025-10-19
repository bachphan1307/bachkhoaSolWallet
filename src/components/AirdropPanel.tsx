import { useState } from 'react';
import type { Keypair } from '@solana/web3.js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getConnection } from '../solana/connection';

interface AirdropPanelProps {
  wallet: Keypair;
  onTransaction: (signature: string) => void;
}

const AirdropPanel = ({ wallet, onTransaction }: AirdropPanelProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAirdrop = async () => {
    const connection = getConnection();
    try {
      setIsLoading(true);
      setStatus(null);
      setError(null);
      const latest = await connection.getLatestBlockhash();
      const signature = await connection.requestAirdrop(wallet.publicKey, 2 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction({ signature, ...latest });
      onTransaction(signature);
      setStatus('Đã nhận airdrop 2 SOL');
    } catch (airdropError) {
      console.error(airdropError);
      setStatus(null);
      setError(airdropError instanceof Error ? airdropError.message : String(airdropError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Airdrop</h2>
      <button onClick={handleAirdrop} disabled={isLoading}>
        {isLoading ? 'Đang airdrop...' : 'Airdrop 2 SOL'}
      </button>
      {status ? <div className="status success">{status}</div> : null}
      {error ? <div className="status error">{error}</div> : null}
    </section>
  );
};

export default AirdropPanel;
