import { useState } from 'react';
import WalletManager from './components/WalletManager';
import BalancePanel from './components/BalancePanel';
import AirdropPanel from './components/AirdropPanel';
import TransferForm, { type TransactionHistory } from './components/TransferForm';
import TxList from './components/TxList';
import './app.css';

type Wallet = {
  address: string;
  balance: number;
};

function App() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);

  const selectedWallet = selectedAddress
    ? wallets.find((wallet) => wallet.address === selectedAddress) ?? null
    : null;

  const upsertWallet = (wallet: Wallet) => {
    setWallets((prev) => {
      const index = prev.findIndex((item) => item.address === wallet.address);
      if (index === -1) {
        return [...prev, wallet];
      }
      const next = [...prev];
      next[index] = wallet;
      return next;
    });
    setSelectedAddress(wallet.address);
  };

  const handleWalletSelect = (address: string) => {
    setSelectedAddress(address);
  };

  const handleWalletRemove = (address: string) => {
    setWallets((prev) => prev.filter((wallet) => wallet.address !== address));
    setSelectedAddress((current) => (current === address ? null : current));
  };

  const handleBalanceChange = (address: string, balance: number) => {
    setWallets((prev) =>
      prev.map((wallet) =>
        wallet.address === address ? { ...wallet, balance } : wallet
      )
    );
  };

  const handleTransactionAdded = (entry: TransactionHistory) => {
    setTransactions((prev) => [entry, ...prev]);
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>Bach Khoa Sol Wallet</h1>
        <p className="app__subtitle">
          Công cụ quản lý ví Solana local phục vụ học tập và phát triển.
        </p>
      </header>

      <main className="app__layout">
        <section className="app__column">
          <WalletManager
            wallets={wallets}
            selectedAddress={selectedAddress}
            onWalletSelect={handleWalletSelect}
            onWalletUpdate={upsertWallet}
            onWalletRemove={handleWalletRemove}
          />

          <BalancePanel
            wallet={selectedWallet}
            onBalanceChange={handleBalanceChange}
          />
        </section>

        <section className="app__column">
          <AirdropPanel
            wallet={selectedWallet}
            onWalletUpdate={upsertWallet}
          />

          <TransferForm
            wallet={selectedWallet}
            onWalletUpdate={upsertWallet}
            onTransactionAdded={handleTransactionAdded}
          />
        </section>

        <section className="app__column app__column--full">
          <TxList wallet={selectedWallet} transactions={transactions} />
        </section>
      </main>
    </div>
  );
}

export default App;
