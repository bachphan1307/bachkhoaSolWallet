import { FormEvent, useMemo, useState } from 'react';

export type Wallet = {
  address: string;
  balance: number;
};

type WalletManagerProps = {
  wallets: Wallet[];
  selectedAddress: string | null;
  onWalletSelect: (address: string) => void;
  onWalletUpdate: (wallet: Wallet) => void;
  onWalletRemove?: (address: string) => void;
};

const WalletManager = ({
  wallets,
  selectedAddress,
  onWalletSelect,
  onWalletUpdate,
  onWalletRemove,
}: WalletManagerProps) => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0');

  const isExistingAddress = useMemo(
    () => wallets.some((wallet) => wallet.address === address.trim()),
    [address, wallets]
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const normalizedAddress = address.trim();
    if (!normalizedAddress) {
      return;
    }

    const numericBalance = Number(balance);
    const nextWallet: Wallet = {
      address: normalizedAddress,
      balance: Number.isFinite(numericBalance) ? numericBalance : 0,
    };

    onWalletUpdate(nextWallet);
    setAddress('');
    setBalance('0');
  };

  return (
    <div className="panel">
      <div className="panel__header">
        <h2>Quản lý ví</h2>
        <p className="panel__subtitle">Thêm, chọn hoặc xoá ví được lưu local</p>
      </div>

      <ul className="wallet-list">
        {wallets.length === 0 ? (
          <li className="wallet-list__empty">Chưa có ví nào được lưu</li>
        ) : (
          wallets.map((wallet) => {
            const isSelected = wallet.address === selectedAddress;
            return (
              <li key={wallet.address} className={isSelected ? 'wallet-list__item wallet-list__item--active' : 'wallet-list__item'}>
                <button
                  type="button"
                  className="wallet-list__select"
                  onClick={() => onWalletSelect(wallet.address)}
                >
                  <span className="wallet-list__address">{wallet.address}</span>
                  <span className="wallet-list__balance">{wallet.balance.toLocaleString()} SOL</span>
                </button>
                {onWalletRemove ? (
                  <button
                    type="button"
                    className="wallet-list__remove"
                    onClick={() => onWalletRemove(wallet.address)}
                    aria-label={`Xoá ví ${wallet.address}`}
                  >
                    &times;
                  </button>
                ) : null}
              </li>
            );
          })
        )}
      </ul>

      <form className="wallet-form" onSubmit={handleSubmit}>
        <label className="wallet-form__label" htmlFor="wallet-address">
          Địa chỉ ví
        </label>
        <input
          id="wallet-address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Nhập địa chỉ ví"
          className="wallet-form__input"
        />

        <label className="wallet-form__label" htmlFor="wallet-balance">
          Số dư ban đầu (SOL)
        </label>
        <input
          id="wallet-balance"
          type="number"
          step="0.0001"
          min="0"
          value={balance}
          onChange={(event) => setBalance(event.target.value)}
          className="wallet-form__input"
        />

        <button type="submit" className="wallet-form__submit">
          {isExistingAddress ? 'Cập nhật ví' : 'Thêm ví mới'}
        </button>
      </form>
    </div>
  );
};

export default WalletManager;
