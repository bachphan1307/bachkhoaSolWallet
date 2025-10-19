interface TxListProps {
  transactions: string[];
}

const TxList = ({ transactions }: TxListProps) => {
  return (
    <section className="panel">
      <h2>Lịch sử giao dịch</h2>
      {transactions.length === 0 ? (
        <p>Chưa có giao dịch nào</p>
      ) : (
        <ul className="tx-list">
          {transactions.map((tx) => (
            <li key={tx} className="break-all">
              {tx}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default TxList;
