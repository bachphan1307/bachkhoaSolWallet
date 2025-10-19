import { useCallback, useMemo, useState } from 'react';
import { Keypair } from '@solana/web3.js';
import WalletManager from './components/WalletManager';
import BalancePanel from './components/BalancePanel';
import AirdropPanel from './components/AirdropPanel';
import TransferForm from './components/TransferForm';
import TxList from './components/TxList';
import { generateWallet, loadWallet, saveSecret } from './wallet';
import './app.css';

const MAX_TRACKED_TXS = 10;

const createInitialWallet = (): Keypair => {
  const stored = loadWallet();
  if (stored) {
    return stored;
  }

  const fresh = generateWallet();
  saveSecret(fresh);
  return fresh;
};

function App() {
  const [wallet, setWallet] = useState<Keypair>(() => createInitialWallet());
  const [balanceRefreshToken, setBalanceRefreshToken] = useState(0);
  const [lastTxs, setLastTxs] = useState<string[]>([]);

  const refreshBalance = useCallback(() => {
    setBalanceRefreshToken((token) => token + 1);
  }, []);

  const persistWallet = useCallback((next: Keypair) => {
    saveSecret(next);
    setWallet(next);
    setLastTxs([]);
    setBalanceRefreshToken((token) => token + 1);
  }, []);

  const handleWalletChange = useCallback(
    (nextWallet: Keypair) => {
      persistWallet(nextWallet);
    },
    [persistWallet],
  );

  const recordSignature = useCallback(
    (signature: string) => {
      setLastTxs((prev) => {
        const deduped = prev.filter((tx) => tx !== signature);
        return [signature, ...deduped].slice(0, MAX_TRACKED_TXS);
      });
      refreshBalance();
    },
    [refreshBalance],
  );

  const handleAirdropDone = useCallback(
    (signature: string) => {
      recordSignature(signature);
    },
    [recordSignature],
  );

  const handleTransferSent = useCallback(
    (signature: string) => {
      recordSignature(signature);
    },
    [recordSignature],
  );

  const walletManagerKey = useMemo(() => wallet.publicKey.toBase58(), [wallet]);

  return (
    <div className="app">
      <h1>Bach Khoa Sol Wallet</h1>

      <section className="grid">
        <WalletManager
          key={walletManagerKey}
          initialWallet={wallet}
          onChange={handleWalletChange}
        />
        <BalancePanel wallet={wallet} refreshToken={balanceRefreshToken} />
      </section>

      <section className="grid">
        <AirdropPanel wallet={wallet} onDone={handleAirdropDone} />
        <TransferForm wallet={wallet} onSent={handleTransferSent} />
      </section>

      <TxList txs={lastTxs} />
    </div>
  );
}

export default App;
