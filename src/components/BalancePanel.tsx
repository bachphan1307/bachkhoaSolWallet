import { useCallback, useEffect, useMemo, useState } from 'react';
import { Keypair } from '@solana/web3.js';
import { getBalance } from '../solana';

type BalancePanelProps = {
  wallet: Keypair;
};

export const BalancePanel = ({ wallet }: BalancePanelProps) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const address = useMemo(() => wallet.publicKey.toBase58(), [wallet]);

  const refreshBalance = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const value = await getBalance(wallet.publicKey);
      setBalance(value);
    } catch (err: any) {
      const message = err?.message ?? 'Không thể lấy số dư';
      setError(message);
    } finally {
      setIsRefreshing(false);
    }
  }, [wallet]);

  useEffect(() => {
    void refreshBalance();
  }, [refreshBalance]);

  return (
    <div className="balance-panel">
      <h2>Số dư ví</h2>
      <div className="balance-info">
        <div>
          <strong>Địa chỉ:</strong> <span className="address">{address}</span>
        </div>
        <div>
          <strong>Số dư:</strong>{' '}
          {balance === null ? '—' : `${balance.toFixed(4)} SOL`}
        </div>
      </div>
      {error ? <div className="balance-error">{error}</div> : null}
      <button type="button" onClick={refreshBalance} disabled={isRefreshing}>
        {isRefreshing ? 'Đang làm mới…' : 'Refresh'}
      </button>
    </div>
  );
};

export default BalancePanel;
