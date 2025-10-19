import React from "react";

type TxListProps = {
  txs: string[];
};

const EXPLORER_BASE_URL = "http://localhost:3000/tx";

const TxList: React.FC<TxListProps> = ({ txs }) => {
  if (!txs || txs.length === 0) {
    return (
      <div className="tx-list">
        <p>Chưa có giao dịch nào.</p>
      </div>
    );
  }

  return (
    <div className="tx-list">
      <h2>Các chữ ký giao dịch gần nhất</h2>
      <ul>
        {txs.map((signature) => {
          const txUrl = `${EXPLORER_BASE_URL}/${encodeURIComponent(signature)}`;
          return (
            <li key={signature}>
              <a href={txUrl} target="_blank" rel="noreferrer">
                {signature}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TxList;
