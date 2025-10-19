import type { Wallet } from './WalletManager';
import type { TransactionHistory } from './TransferForm';

type TxListProps = {
  wallet: Wallet | null;
  transactions: TransactionHistory[];
};

const TxList = ({ wallet, transactions }: TxListProps) => {
  return (
    <div className="panel">
      <div className="panel__header">
        <h2>Lịch sử giao dịch</h2>
        <p className="panel__subtitle">
          Theo dõi những giao dịch giả lập được thực hiện từ ví hiện tại
        </p>
      </div>

      {wallet ? (
        <div className="tx-list__summary">
          <span className="tx-list__label">Ví đang theo dõi:</span>
          <span className="tx-list__address">{wallet.address}</span>
        </div>
      ) : (
        <p className="panel__empty">Chọn ví để xem lịch sử giao dịch.</p>
      )}

      <ul className="tx-list">
        {transactions.length === 0 ? (
          <li className="tx-list__empty">Chưa có giao dịch nào được ghi nhận.</li>
        ) : (
          transactions.map((transaction) => (
            <li key={transaction.signature} className="tx-list__item">
              <span className="tx-list__signature">{transaction.signature}</span>
              <span className="tx-list__description">
                {transaction.description ?? 'Giao dịch mô phỏng'}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TxList;
