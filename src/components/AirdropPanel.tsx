import { FormEvent, useState } from 'react';
import type { Wallet } from './WalletManager';

type AirdropPanelProps = {
  wallet: Wallet | null;
  onWalletUpdate: (wallet: Wallet) => void;
};

const AirdropPanel = ({ wallet, onWalletUpdate }: AirdropPanelProps) => {
  const [amount, setAmount] = useState('1');
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!wallet) {
      setStatus('Chọn ví trước khi yêu cầu airdrop.');
      return;
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setStatus('Nhập số SOL hợp lệ (> 0).');
      return;
    }

    const nextWallet: Wallet = {
      ...wallet,
      balance: wallet.balance + numericAmount,
    };

    onWalletUpdate(nextWallet);
    setStatus(`Đã cộng ${numericAmount} SOL vào ví.`);
  };

  return (
    <div className="panel">
      <div className="panel__header">
        <h2>Airdrop</h2>
        <p className="panel__subtitle">Mô phỏng nhận SOL vào ví local</p>
      </div>

      <form className="airdrop-form" onSubmit={handleSubmit}>
        <label className="airdrop-form__label" htmlFor="airdrop-amount">
          Số SOL cần nhận
        </label>
        <input
          id="airdrop-amount"
          type="number"
          step="0.1"
          min="0"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="airdrop-form__input"
          placeholder="Ví dụ: 2"
        />
        <button type="submit" className="airdrop-form__submit">
          Nhận airdrop
        </button>
      </form>

      {status ? <p className="panel__status">{status}</p> : null}
    </div>
  );
};

export default AirdropPanel;
