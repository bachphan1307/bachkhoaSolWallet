import { useEffect, useState } from 'react';
import type { Keypair } from '@solana/web3.js';
import WalletManager from './components/WalletManager';
import BalancePanel from './components/BalancePanel';
import AirdropPanel from './components/AirdropPanel';
import TransferForm from './components/TransferForm';
import TxList from './components/TxList';
import { generateWallet, loadWallet, saveSecret } from './wallet';

const App = () => {
  const [wallet, setWallet] = useState<Keypair>(() => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return generateWallet();
    }

    const existing = loadWallet();
    return existing ?? generateWallet();
  });
  const [lastTxs, setLastTxs] = useState<string[]>([]);

  const handleWalletChange = (nextWallet: Keypair) => {
    setWallet(nextWallet);
    setLastTxs([]);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    saveSecret(wallet);
  }, [wallet]);

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
