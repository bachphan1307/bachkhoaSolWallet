import { FormEvent, useEffect, useState } from 'react';
import type { Wallet } from './WalletManager';

type BalancePanelProps = {
  wallet: Wallet | null;
  onBalanceChange: (address: string, balance: number) => void;
};

const BalancePanel = ({ wallet, onBalanceChange }: BalancePanelProps) => {
  const [balanceDraft, setBalanceDraft] = useState('');

  useEffect(() => {
    setBalanceDraft(wallet ? wallet.balance.toString() : '');
  }, [wallet?.address, wallet?.balance]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!wallet) {
      return;
    }

    const nextBalance = Number(balanceDraft);
    if (!Number.isFinite(nextBalance)) {
      return;
    }

    onBalanceChange(wallet.address, nextBalance);
  };

  return (
    <div className="panel">
      <div className="panel__header">
        <h2>Số dư ví</h2>
        <p className="panel__subtitle">Theo dõi số dư hiện tại của ví đã chọn</p>
      </div>

      {wallet ? (
        <>
          <div className="balance-card">
            <div className="balance-card__row">
              <span className="balance-card__label">Địa chỉ</span>
              <span className="balance-card__value">{wallet.address}</span>
            </div>
            <div className="balance-card__row">
              <span className="balance-card__label">Số dư hiện tại</span>
              <span className="balance-card__value balance-card__value--accent">
                {wallet.balance.toLocaleString()} SOL
              </span>
            </div>
          </div>

          <form className="balance-form" onSubmit={handleSubmit}>
            <label className="balance-form__label" htmlFor="balance-adjust">
              Điều chỉnh số dư thủ công
            </label>
            <input
              id="balance-adjust"
              type="number"
              step="0.0001"
              value={balanceDraft}
              onChange={(event) => setBalanceDraft(event.target.value)}
              className="balance-form__input"
            />
            <button type="submit" className="balance-form__submit">
              Cập nhật số dư
            </button>
          </form>
        </>
      ) : (
        <p className="panel__empty">Chọn ví từ danh sách để xem số dư.</p>
      )}
    </div>
  );
};

export default BalancePanel;
