import { useCallback, useEffect, useMemo, useState } from 'react';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import { clearSecret, loadSecret, saveSecret } from '../utils/storage';

const keypairFromSecret = (secret: string): Keypair | null => {
  try {
    const secretKey = bs58.decode(secret);
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    console.error('Invalid secret key', error);
    return null;
  }
};

const keypairToSecret = (keypair: Keypair) => bs58.encode(keypair.secretKey);

export const useKeypair = () => {
  const [keypair, setKeypair] = useState<Keypair>(() => {
    const stored = loadSecret();
    if (stored) {
      const fromSecret = keypairFromSecret(stored);
      if (fromSecret) {
        return fromSecret;
      }
    }
    const fresh = Keypair.generate();
    saveSecret(keypairToSecret(fresh));
    return fresh;
  });

  useEffect(() => {
    saveSecret(keypairToSecret(keypair));
  }, [keypair]);

  const regenerate = useCallback(() => {
    const fresh = Keypair.generate();
    setKeypair(fresh);
    saveSecret(keypairToSecret(fresh));
  }, []);

  const importFromSecret = useCallback((secret: string) => {
    const imported = keypairFromSecret(secret);
    if (!imported) {
      throw new Error('Secret key không hợp lệ (base58)');
    }
    setKeypair(imported);
    saveSecret(secret);
  }, []);

  const exportSecret = useCallback(() => keypairToSecret(keypair), [keypair]);

  const clear = useCallback(() => {
    clearSecret();
    regenerate();
  }, [regenerate]);

  return useMemo(
    () => ({ keypair, regenerate, importFromSecret, exportSecret, clear }),
    [keypair, regenerate, importFromSecret, exportSecret, clear]
  );
};
