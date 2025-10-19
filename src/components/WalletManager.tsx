import { useState } from 'react';
import type { Keypair } from '@solana/web3.js';
import { exportSecret, generateWallet, importSecret } from '../wallet';

interface WalletManagerProps {
  wallet: Keypair;
  onWalletChange: (wallet: Keypair) => void;
}

const WalletManager = ({ wallet, onWalletChange }: WalletManagerProps) => {
  const [secretToImport, setSecretToImport] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    const next = generateWallet();
    onWalletChange(next);
    setSecretToImport('');
    setError(null);
    setStatus('Đã tạo ví mới');
  };

  const handleImport = () => {
    try {
      if (!secretToImport.trim()) {
        throw new Error('Nhập secret key (base58)');
      }
      const next = importSecret(secretToImport.trim());
      onWalletChange(next);
      setError(null);
      setStatus('Đã import ví');
    } catch (importError) {
      console.error(importError);
      setStatus(null);
      setError(importError instanceof Error ? importError.message : String(importError));
    }
  };

  const handleCopySecret = async () => {
    try {
      const secret = exportSecret(wallet);
      await navigator.clipboard.writeText(secret);
      setError(null);
      setStatus('Đã copy secret key vào clipboard');
    } catch (copyError) {
      console.error(copyError);
      setStatus(null);
      setError(copyError instanceof Error ? copyError.message : String(copyError));
    }
  };

  return (
    <section className="panel">
      <h2>Wallet Manager</h2>
      <div className="card">
        <div>
          <strong>Địa chỉ ví:</strong>
        </div>
        <div className="break-all">{wallet.publicKey.toBase58()}</div>
      </div>

      <div className="button-row">
        <button onClick={handleGenerate}>Tạo ví mới</button>
        <button onClick={handleCopySecret}>Copy secret</button>
      </div>

      <label htmlFor="secret-import">Import secret key (base58)</label>
      <textarea
        id="secret-import"
        value={secretToImport}
        onChange={(event) => setSecretToImport(event.target.value)}
        placeholder="Dán secret key (base58) vào đây"
      />
      <button onClick={handleImport}>Import ví</button>

      {status ? <div className="status success">{status}</div> : null}
      {error ? <div className="status error">{error}</div> : null}
    </section>
  );
};

export default WalletManager;
