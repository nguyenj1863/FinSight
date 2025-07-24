import React, { useEffect, useState } from 'react';

const TransactionTable = ({ portfolioId }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/portfolio/${portfolioId}/transactions`)
      .then(res => res.json())
      .then(res => setTransactions(res.transactions))
      .catch(console.error);
  }, [portfolioId]);

  if (!transactions.length) return <p className="text-gray-500">No transactions found.</p>;

  return (
    <div className="w-full p-4 bg-white shadow rounded mt-6 overflow-x-auto">
      <h3 className="text-lg font-bold mb-4">Transaction History</h3>
      <table className="w-full table-auto text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border-b">Ticker</th>
            <th className="p-2 border-b">Name</th>
            <th className="p-2 border-b">Sector</th>
            <th className="p-2 border-b">Quantity</th>
            <th className="p-2 border-b">Price</th>
            <th className="p-2 border-b">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="p-2 border-b">{tx.ticker}</td>
              <td className="p-2 border-b">{tx.name}</td>
              <td className="p-2 border-b">{tx.sector || 'N/A'}</td>
              <td className="p-2 border-b">{tx.quantity}</td>
              <td className="p-2 border-b">${tx.price.toFixed(2)}</td>
              <td className="p-2 border-b">{tx.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
