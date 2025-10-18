import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { getConnection, getDevnetFallback } from './solana/connection';
import { useKeypair } from './hooks/useKeypair';

const formatLamports = (lamports: number) => (lamports / LAMPORTS_PER_SOL).toFixed(4);

type Status = { message: string; variant: 'success' | 'error' } | null;

function App() {
  const { keypair, regenerate, importFromSecret, exportSecret } = useKeypair();
  const [endpoint, setEndpoint] = useState('http://127.0.0.1:8899');
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [secretToImport, setSecretToImport] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const connection = useMemo(() => getConnection(endpoint), [endpoint]);

  const withLoader = useCallback(async (fn: () => Promise<void>) => {
    setIsLoading(true);
    setStatus(null);
    try {
      await fn();
    } catch (error: any) {
      setStatus({ message: error?.message ?? String(error), variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    await withLoader(async () => {
      const value = await connection.getBalance(keypair.publicKey);
      setBalance(value);
      setStatus({ message: 'Đã cập nhật số dư', variant: 'success' });
    });
  }, [connection, keypair.publicKey, withLoader]);

  useEffect(() => {
    void refreshBalance();
  }, [refreshBalance]);

  const handleAirdrop = async () => {
    await withLoader(async () => {
      const latest = await connection.getLatestBlockhash();
      const signature = await connection.requestAirdrop(keypair.publicKey, 2 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction({ signature, ...latest });
      setStatus({ message: 'Đã nhận airdrop 2 SOL', variant: 'success' });
      await refreshBalance();
    });
  };

  const handleSend = async () => {
    await withLoader(async () => {
      const lamports = Math.floor(Number(amount) * LAMPORTS_PER_SOL);
      if (!lamports || lamports <= 0) {
        throw new Error('Nhập số SOL hợp lệ (>0)');
      }
      let to: PublicKey;
      try {
        to = new PublicKey(recipient);
      } catch {
        throw new Error('Địa chỉ nhận không hợp lệ');
      }
      const latest = await connection.getLatestBlockhash();
      const tx = new Transaction({
        feePayer: keypair.publicKey,
        blockhash: latest.blockhash,
        lastValidBlockHeight: latest.lastValidBlockHeight,
      }).add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: to,
          lamports,
        })
      );
      const signature = await connection.sendTransaction(tx, [keypair]);
      await connection.confirmTransaction({ signature, ...latest });
      setStatus({ message: `Đã gửi ${Number(amount)} SOL tới ${to.toBase58()}`, variant: 'success' });
      setAmount('');
      setRecipient('');
      await refreshBalance();
    });
  };

  const handleImportSecret = async () => {
    await withLoader(async () => {
      if (!secretToImport.trim()) {
        throw new Error('Nhập secret key (base58)');
      }
      importFromSecret(secretToImport.trim());
      setSecretToImport('');
      setStatus({ message: 'Đã import ví', variant: 'success' });
      await refreshBalance();
    });
  };

  const handleCopySecret = async () => {
    const secret = exportSecret();
    await navigator.clipboard.writeText(secret);
    setStatus({ message: 'Đã copy secret key vào clipboard', variant: 'success' });
  };

  const fallbackToDevnet = () => {
    setEndpoint(getDevnetFallback());
    setStatus({ message: 'Chuyển sang devnet làm dự phòng', variant: 'success' });
  };

  return (
    <div className="app">
      <h1>Bach Khoa Sol Wallet</h1>
      <section className="grid">
        <div>
          <label>Endpoint RPC</label>
          <input
            value={endpoint}
            onChange={(event) => setEndpoint(event.target.value)}
            placeholder="http://127.0.0.1:8899"
          />
          <div className="flex-between">
            <button onClick={refreshBalance} disabled={isLoading}>
              Làm mới số dư
            </button>
            <button onClick={fallbackToDevnet} disabled={isLoading}>
              Dùng devnet
            </button>
          </div>
        </div>

        <div>
          <label>Ví hiện tại</label>
          <div className="card">
            <div><strong>Địa chỉ:</strong> {keypair.publicKey.toBase58()}</div>
            <div>
              <strong>Số dư:</strong>{' '}
              {balance === null ? '—' : `${formatLamports(balance)} SOL (${balance} lamports)`}
            </div>
          </div>
          <div className="flex-between">
            <button onClick={regenerate} disabled={isLoading}>
              Tạo ví mới
            </button>
            <button onClick={handleAirdrop} disabled={isLoading}>
              Airdrop 2 SOL
            </button>
            <button onClick={handleCopySecret} disabled={isLoading}>
              Copy secret
            </button>
          </div>
        </div>

        <div>
          <label>Gửi SOL</label>
          <input
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
            placeholder="Địa chỉ người nhận"
          />
          <input
            type="number"
            min="0"
            step="0.0001"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Số SOL"
          />
          <button onClick={handleSend} disabled={isLoading}>
            Gửi giao dịch
          </button>
        </div>

        <div>
          <label>Import secret key (base58)</label>
          <textarea
            value={secretToImport}
            onChange={(event) => setSecretToImport(event.target.value)}
            placeholder="Dán secret key (base58) vào đây"
          />
          <button onClick={handleImportSecret} disabled={isLoading}>
            Import ví
          </button>
        </div>
      </section>

      {status ? (
        <div className={`status ${status.variant === 'error' ? 'error' : ''}`}>
          {status.message}
        </div>
      ) : null}
    </div>
  );
}

export default App;
