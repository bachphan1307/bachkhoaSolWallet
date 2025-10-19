import { FormEvent, useState } from 'react';
import type { Wallet } from './WalletManager';

export type TransactionHistory = {
  signature: string;
  description?: string;
};

type TransferFormProps = {
  wallet: Wallet | null;
  onWalletUpdate: (wallet: Wallet) => void;
  onTransactionAdded: (entry: TransactionHistory) => void;
};

const TransferForm = ({ wallet, onWalletUpdate, onTransactionAdded }: TransferFormProps) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('0');
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!wallet) {
      setStatus('Chọn ví nguồn trước khi gửi SOL.');
      return;
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setStatus('Nhập số SOL hợp lệ (> 0).');
      return;
    }

    if (numericAmount > wallet.balance) {
      setStatus('Số dư không đủ để thực hiện giao dịch.');
      return;
    }

    const signature = `sig_${Math.random().toString(36).slice(2, 10)}`;
    const nextWallet: Wallet = {
      ...wallet,
      balance: wallet.balance - numericAmount,
    };

    onWalletUpdate(nextWallet);
    onTransactionAdded({
      signature,
      description: `Gửi ${numericAmount} SOL tới ${recipient || 'địa chỉ không xác định'}`,
    });

    setStatus('Giao dịch giả lập đã được ghi nhận.');
    setRecipient('');
    setAmount('0');
  };

  return (
    <div className="panel">
      <div className="panel__header">
        <h2>Gửi SOL</h2>
        <p className="panel__subtitle">Tạo giao dịch chuyển SOL giữa các ví local</p>
      </div>

      <form className="transfer-form" onSubmit={handleSubmit}>
        <label className="transfer-form__label" htmlFor="transfer-recipient">
          Địa chỉ nhận
        </label>
        <input
          id="transfer-recipient"
          value={recipient}
          onChange={(event) => setRecipient(event.target.value)}
          placeholder="Nhập địa chỉ nhận"
          className="transfer-form__input"
        />

        <label className="transfer-form__label" htmlFor="transfer-amount">
          Số SOL muốn gửi
        </label>
        <input
          id="transfer-amount"
          type="number"
          step="0.0001"
          min="0"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="transfer-form__input"
        />

        <button type="submit" className="transfer-form__submit">
          Gửi giao dịch
        </button>
      </form>

      {status ? <p className="panel__status">{status}</p> : null}
    </div>
  );
};

export default TransferForm;
