# Bach Khoa Sol Wallet

Ví web3 tối giản chạy trên Solana localnet, viết bằng React + TypeScript + Vite.

## Chuẩn bị

```bash
npm install
```

Khởi động Solana localnet:

```bash
solana-test-validator
```

## Chạy dự án

```bash
npm run dev
```

Ứng dụng mặc định kết nối `http://127.0.0.1:8899`. Có sẵn nút chuyển qua devnet khi cần.

## Tính năng chính

- Sinh/regen ví (Keypair) và lưu localStorage
- Import/export secret key (base58)
- Hiển thị số dư, làm mới
- Airdrop 2 SOL
- Gửi SOL tới địa chỉ khác
