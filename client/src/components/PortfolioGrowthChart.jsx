import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PortfolioGrowthChart = ({ portfolioId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/portfolio/${portfolioId}/transactions`)
      .then(res => res.json())
      .then(res => {
        const dailyTotals = {};

        res.transactions.forEach(tx => {
          const value = tx.quantity * tx.price;
          if (!dailyTotals[tx.date]) dailyTotals[tx.date] = 0;
          dailyTotals[tx.date] += value;
        });

        const cumulative = [];
        let runningTotal = 0;
        Object.entries(dailyTotals)
          .sort(([a], [b]) => new Date(a) - new Date(b))
          .forEach(([date, value]) => {
            runningTotal += value;
            cumulative.push({ date, value: runningTotal });
          });

        setData(cumulative);
      })
      .catch(console.error);
  }, [portfolioId]);

  if (!data.length) return <p className="text-gray-500">No transaction data to plot.</p>;

  return (
    <div className="w-full h-96 p-4 bg-white shadow rounded">
      <h3 className="text-lg font-bold mb-4">Portfolio Growth Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioGrowthChart;
