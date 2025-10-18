// Chỉ dùng cho học tập, không an toàn.
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const STORAGE_KEY = "demo-secret";

export function generateWallet(): Keypair {
  return Keypair.generate();
}

export function saveSecret(keypair: Keypair): void {
  const secret = exportSecret(keypair);
  localStorage.setItem(STORAGE_KEY, secret);
}

export function loadWallet(): Keypair | null {
  const secret = localStorage.getItem(STORAGE_KEY);
  if (!secret) {
    return null;
  }

  try {
    return importSecret(secret);
  } catch (error) {
    console.error("Không thể tải ví từ localStorage", error);
    return null;
  }
}

export function exportSecret(keypair: Keypair): string {
  return bs58.encode(keypair.secretKey);
}

export function importSecret(secret: string): Keypair {
  const decoded = bs58.decode(secret);
  return Keypair.fromSecretKey(decoded);
}
