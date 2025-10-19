import { useState } from 'react';
import type { Keypair } from '@solana/web3.js';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { getConnection } from '../solana/connection';

interface TransferFormProps {
  wallet: Keypair;
  onTransaction: (signature: string) => void;
}

const TransferForm = ({ wallet, onTransaction }: TransferFormProps) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    const connection = getConnection();
    try {
      setIsLoading(true);
      setStatus(null);
      setError(null);

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
        feePayer: wallet.publicKey,
        blockhash: latest.blockhash,
        lastValidBlockHeight: latest.lastValidBlockHeight,
      }).add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: to,
          lamports,
        })
      );

      const signature = await connection.sendTransaction(tx, [wallet]);
      await connection.confirmTransaction({ signature, ...latest });
      onTransaction(signature);
      setRecipient('');
      setAmount('');
      setStatus(`Đã gửi ${Number(amount)} SOL tới ${to.toBase58()}`);
    } catch (sendError) {
      console.error(sendError);
      setStatus(null);
      setError(sendError instanceof Error ? sendError.message : String(sendError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Chuyển SOL</h2>
      <label htmlFor="recipient">Địa chỉ người nhận</label>
      <input
        id="recipient"
        value={recipient}
        onChange={(event) => setRecipient(event.target.value)}
        placeholder="Địa chỉ người nhận"
      />
      <label htmlFor="amount">Số lượng SOL</label>
      <input
        id="amount"
        type="number"
        min="0"
        step="0.0001"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        placeholder="Số SOL"
      />
      <button onClick={handleSend} disabled={isLoading}>
        {isLoading ? 'Đang gửi...' : 'Gửi giao dịch'}
      </button>
      {status ? <div className="status success">{status}</div> : null}
      {error ? <div className="status error">{error}</div> : null}
    </section>
  );
};

export default TransferForm;
