import { useCallback, useState } from 'react';
import { Keypair } from '@solana/web3.js';
import { airdrop } from '../solana';

type AirdropPanelProps = {
  wallet: Keypair;
  onDone: () => void;
};

export const AirdropPanel = ({ wallet, onDone }: AirdropPanelProps) => {
  const [amount, setAmount] = useState('1');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAirdrop = useCallback(async () => {
    const parsed = parseFloat(amount);

    if (Number.isNaN(parsed) || parsed <= 0) {
      setMessage('Số lượng SOL phải lớn hơn 0');
      return;
    }

    try {
      setLoading(true);
      setMessage('Đang yêu cầu airdrop...');
      await airdrop(wallet.publicKey, parsed);
      setMessage(`Đã airdrop ${parsed} SOL thành công`);
      onDone();
    } catch (error: any) {
      const errorMessage = error?.message ?? 'Không thể airdrop SOL';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [amount, wallet, onDone]);

  return (
    <div className="airdrop-panel">
      <h2>Airdrop SOL</h2>
      <div className="airdrop-input">
        <label htmlFor="airdrop-amount">Số lượng SOL</label>
        <input
          id="airdrop-amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          disabled={loading}
        />
      </div>
      <button type="button" onClick={handleAirdrop} disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Airdrop'}
      </button>
      {message ? <div className="status-message">{message}</div> : null}
    </div>
  );
};

export default AirdropPanel;
