import { ChangeEvent, FormEvent, useState } from 'react';

type Wallet = {
  address: string;
  balance: number;
};

type WalletManagerProps = {
  wallet: Wallet | null;
  onChange: (wallet: Wallet | null) => void;
};

type BalancePanelProps = {
  wallet: Wallet | null;
};

type AirdropPanelProps = {
  wallet: Wallet | null;
  onAirdrop: (signature: string, amount: number) => void;
};

type TransferFormProps = {
  wallet: Wallet | null;
  onTransfer: (signature: string, amount: number) => void;
};

type TxListProps = {
  transactions: string[];
};

const WalletManager = ({ wallet, onChange }: WalletManagerProps) => {
  const createWallet = () => {
    const randomSuffix = Math.random().toString(36).slice(2, 10).toUpperCase();
    onChange({ address: `BK${randomSuffix}`, balance: 0 });
  };

  const clearWallet = () => {
    onChange(null);
  };

  return (
    <section>
      <h2>Wallet Manager</h2>
      {wallet ? (
        <div className="card">
          <div>
            <strong>Địa chỉ:</strong> {wallet.address}
          </div>
          <div>
            <strong>Số dư:</strong> {wallet.balance.toFixed(2)} SOL
          </div>
        </div>
      ) : (
        <p>Chưa có ví nào được chọn.</p>
      )}
      <div className="flex-between">
        <button type="button" onClick={createWallet}>
          Tạo ví ngẫu nhiên
        </button>
        <button type="button" onClick={clearWallet} disabled={!wallet}>
          Xoá ví
        </button>
      </div>
    </section>
  );
};

const BalancePanel = ({ wallet }: BalancePanelProps) => {
  return (
    <section>
      <h2>Số dư ví</h2>
      {wallet ? (
        <div className="card">
          <div>
            <strong>{wallet.address}</strong>
          </div>
          <div>
            Hiện có {wallet.balance.toFixed(2)} SOL
          </div>
        </div>
      ) : (
        <p>Chưa có ví được chọn.</p>
      )}
    </section>
  );
};

const AirdropPanel = ({ wallet, onAirdrop }: AirdropPanelProps) => {
  const [amount, setAmount] = useState(1);

  const updateAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (!Number.isNaN(value)) {
      setAmount(Math.max(0, value));
    }
  };

  const handleAirdrop = () => {
    if (!wallet || amount <= 0) {
      return;
    }
    const signature = `airdrop-${Date.now()}`;
    onAirdrop(signature, amount);
  };

  return (
    <section>
      <h2>Airdrop</h2>
      <label>
        Số SOL muốn nhận
        <input type="number" min={0} value={amount} onChange={updateAmount} />
      </label>
      <button type="button" onClick={handleAirdrop} disabled={!wallet || amount <= 0}>
        Nhận SOL
      </button>
    </section>
  );
};

const TransferForm = ({ wallet, onTransfer }: TransferFormProps) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!wallet) {
      return;
    }

    const parsed = Number(amount);
    if (!recipient.trim() || Number.isNaN(parsed) || parsed <= 0) {
      return;
    }

    const signature = `transfer-${Date.now()}`;
    onTransfer(signature, parsed);
    setRecipient('');
    setAmount('');
  };

  return (
    <section>
      <h2>Chuyển SOL</h2>
      <form onSubmit={handleSubmit} className="grid">
        <label>
          Địa chỉ nhận
          <input value={recipient} onChange={(event) => setRecipient(event.target.value)} />
        </label>
        <label>
          Số SOL
          <input value={amount} onChange={(event) => setAmount(event.target.value)} />
        </label>
        <button type="submit" disabled={!wallet}>
          Gửi
        </button>
      </form>
    </section>
  );
};

const TxList = ({ transactions }: TxListProps) => {
  return (
    <section>
      <h2>Lịch sử giao dịch</h2>
      {transactions.length === 0 ? (
        <p>Chưa có giao dịch nào.</p>
      ) : (
        <ul>
          {transactions.map((tx) => (
            <li key={tx}>{tx}</li>
          ))}
        </ul>
      )}
    </section>
  );
};

const App = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [lastTxs, setLastTxs] = useState<string[]>([]);

  const pushTransaction = (signature: string) => {
    setLastTxs((previous) => [signature, ...previous].slice(0, 10));
  };

  const handleAirdrop = (signature: string, amount: number) => {
    setWallet((current) => (current ? { ...current, balance: current.balance + amount } : current));
    pushTransaction(signature);
  };

  const handleTransfer = (signature: string, amount: number) => {
    setWallet((current) =>
      current ? { ...current, balance: Math.max(0, current.balance - amount) } : current
    );
    pushTransaction(signature);
  };

  return (
    <div className="app">
      <h1>Bach Khoa Sol Wallet</h1>
      <WalletManager wallet={wallet} onChange={setWallet} />
      <BalancePanel wallet={wallet} />
      <AirdropPanel wallet={wallet} onAirdrop={handleAirdrop} />
      <TransferForm wallet={wallet} onTransfer={handleTransfer} />
      <TxList transactions={lastTxs} />
    </div>
  );
};

export default App;
