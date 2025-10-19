import { useState } from 'react';
import type { Keypair } from '@solana/web3.js';
import WalletManager from './components/WalletManager';
import BalancePanel from './components/BalancePanel';
import AirdropPanel from './components/AirdropPanel';
import TransferForm from './components/TransferForm';
import TxList from './components/TxList';
import { generateWallet, loadWallet, saveSecret } from './wallet';

const App = () => {
  const [wallet, setWallet] = useState<Keypair>(() => {
    const existing = loadWallet();
    if (existing) {
      return existing;
    }
    const created = generateWallet();
    saveSecret(created);
    return created;
  });
  const [lastTxs, setLastTxs] = useState<string[]>([]);

  const handleWalletChange = (nextWallet: Keypair) => {
    saveSecret(nextWallet);
    setWallet(nextWallet);
    setLastTxs([]);
  };

  const handleAddTransaction = (signature: string) => {
    setLastTxs((prev) => {
      const updated = [signature, ...prev];
      return updated.slice(0, 10);
    });
  };

  return (
    <div className="app">
      <h1>Bach Khoa Sol Wallet</h1>
      <div className="grid">
        <WalletManager wallet={wallet} onWalletChange={handleWalletChange} />
        <BalancePanel wallet={wallet} lastTxs={lastTxs} />
        <AirdropPanel wallet={wallet} onTransaction={handleAddTransaction} />
        <TransferForm wallet={wallet} onTransaction={handleAddTransaction} />
        <TxList transactions={lastTxs} />
      </div>
    </div>
  );
};

export default App;
