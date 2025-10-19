import { useCallback, useEffect, useMemo, useState } from 'react';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

type WalletManagerProps = {
  onChange: (wallet: Keypair) => void;
};

const decodeSecret = (secret: string): Keypair => {
  const cleaned = secret.trim();
  if (!cleaned) {
    throw new Error('Secret key không được để trống');
  }
  try {
    const secretKey = bs58.decode(cleaned);
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    throw new Error('Secret key không hợp lệ (base58)');
  }
};

const encodeSecret = (wallet: Keypair) => bs58.encode(wallet.secretKey);

export const WalletManager = ({ onChange }: WalletManagerProps) => {
  const [wallet, setWallet] = useState<Keypair>(() => Keypair.generate());
  const [secretToImport, setSecretToImport] = useState('');
  const [exportedSecret, setExportedSecret] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    onChange(wallet);
  }, [wallet, onChange]);

  const currentAddress = useMemo(() => wallet.publicKey.toBase58(), [wallet]);

  const handleGenerate = useCallback(() => {
    const fresh = Keypair.generate();
    setWallet(fresh);
    setExportedSecret('');
    setMessage('Đã tạo ví mới');
  }, []);

  const handleImport = useCallback(() => {
    try {
      const imported = decodeSecret(secretToImport);
      setWallet(imported);
      setSecretToImport('');
      setExportedSecret('');
      setMessage('Đã nhập ví từ secret key');
    } catch (error: any) {
      setMessage(error?.message ?? 'Secret key không hợp lệ');
    }
  }, [secretToImport]);

  const handleExport = useCallback(async () => {
    const secret = encodeSecret(wallet);
    setExportedSecret(secret);
    setMessage('Đã xuất secret key (base58)');
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(secret);
        setMessage('Đã copy secret key vào clipboard');
      } catch (error) {
        console.warn('Không thể copy secret key', error);
      }
    }
  }, [wallet]);

  return (
    <div className="wallet-manager">
      <h2>Quản lý ví</h2>
      <div className="wallet-info">
        <strong>Địa chỉ hiện tại:</strong>
        <div className="address">{currentAddress}</div>
      </div>

      <div className="actions">
        <button type="button" onClick={handleGenerate}>
          Tạo ví mới
        </button>
      </div>

      <div className="import-secret">
        <textarea
          value={secretToImport}
          onChange={(event) => setSecretToImport(event.target.value)}
          placeholder="Nhập secret key (base58)"
          rows={3}
        />
        <button type="button" onClick={handleImport}>
          Nhập secret base58
        </button>
      </div>

      <div className="export-secret">
        <button type="button" onClick={handleExport}>
          Xuất secret
        </button>
        {exportedSecret ? (
          <textarea value={exportedSecret} readOnly rows={3} />
        ) : null}
      </div>

      {message ? <div className="status-message">{message}</div> : null}
    </div>
  );
};

export default WalletManager;
