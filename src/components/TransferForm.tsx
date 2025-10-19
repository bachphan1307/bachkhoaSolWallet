import { FormEvent, useCallback, useState } from 'react';
import { Keypair, PublicKey } from '@solana/web3.js';

import { sendSol } from '../solana';

type TransferFormProps = {
  wallet: Keypair;
  onSent: (signature: string) => void;
};

export const TransferForm = ({ wallet, onSent }: TransferFormProps) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetFeedback = useCallback(() => {
    setStatus(null);
    setSignature(null);
  }, []);

  const validateRecipient = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error('Địa chỉ nhận không được để trống');
    }

    try {
      return new PublicKey(trimmed).toBase58();
    } catch (error) {
      throw new Error('Địa chỉ nhận không hợp lệ (base58)');
    }
  }, []);

  const validateAmount = useCallback((value: string) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      throw new Error('Số lượng SOL phải lớn hơn 0');
    }

    return parsed;
  }, []);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    try {
      const validatedRecipient = validateRecipient(recipient);
      const validatedAmount = validateAmount(amount);

      setIsSubmitting(true);
      const sig = await sendSol(wallet, validatedRecipient, validatedAmount);

      setSignature(sig);
      setStatus('Đã gửi SOL thành công');
      onSent(sig);
    } catch (error: any) {
      setStatus(error?.message ?? 'Không thể gửi SOL');
    } finally {
      setIsSubmitting(false);
    }
  }, [amount, onSent, recipient, validateAmount, validateRecipient, wallet]);

  return (
    <form className="transfer-form" onSubmit={handleSubmit}>
      <h2>Chuyển SOL</h2>

      <label>
        Địa chỉ nhận
        <input
          type="text"
          value={recipient}
          onChange={(event) => {
            setRecipient(event.target.value);
            if (status || signature) {
              resetFeedback();
            }
          }}
          placeholder="Nhập địa chỉ ví (base58)"
        />
      </label>

      <label>
        Số lượng SOL
        <input
          type="number"
          min="0"
          step="any"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            if (status || signature) {
              resetFeedback();
            }
          }}
          placeholder="Nhập số lượng SOL"
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang gửi...' : 'Gửi SOL'}
      </button>

      {status ? <div className="transfer-status">{status}</div> : null}
      {signature ? (
        <div className="transfer-signature">
          <strong>Chữ ký giao dịch:</strong>
          <div>{signature}</div>
        </div>
      ) : null}
    </form>
  );
};

export default TransferForm;
