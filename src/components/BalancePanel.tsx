import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Keypair } from '@solana/web3.js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getConnection } from '../solana/connection';

interface BalancePanelProps {
  wallet: Keypair;
  lastTxs: string[];
}

const formatBalance = (lamports: number | null) => {
  if (lamports === null) {
    return '—';
  }
  return `${(lamports / LAMPORTS_PER_SOL).toFixed(4)} SOL (${lamports} lamports)`;
};

const BalancePanel = ({ wallet, lastTxs }: BalancePanelProps) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connection = useMemo(() => getConnection(), []);

  const refreshBalance = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const value = await connection.getBalance(wallet.publicKey);
      setBalance(value);
    } catch (refreshError) {
      console.error(refreshError);
      setError(refreshError instanceof Error ? refreshError.message : String(refreshError));
    } finally {
      setIsLoading(false);
    }
  }, [connection, wallet.publicKey]);

  useEffect(() => {
    void refreshBalance();
  }, [refreshBalance, wallet, lastTxs]);

  return (
    <section className="panel">
      <h2>Số dư ví</h2>
      <div className="card">
        <div>
          <strong>Địa chỉ ví:</strong>
        </div>
        <div className="break-all">{wallet.publicKey.toBase58()}</div>
        <div className="balance-row">
          <strong>Số dư:</strong> {formatBalance(balance)}
        </div>
      </div>
      <button onClick={refreshBalance} disabled={isLoading}>
        {isLoading ? 'Đang tải...' : 'Làm mới số dư'}
      </button>
      {error ? <div className="status error">{error}</div> : null}
    </section>
  );
};

export default BalancePanel;
