import React, { useEffect, useState } from 'react';

const PortfolioPerformance = ({ portfolioId }) => {
  const [metrics, setMetrics] = useState(null);
  const [cagrData, setCagrData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch general metrics
    fetch(`http://localhost:5000/api/portfolio/${portfolioId}/metrics`)
      .then(res => res.json())
      .then(setMetrics)
      .catch(err => setError("Failed to load metrics"));

    // Fetch CAGR data
    fetch(`http://localhost:5000/api/portfolio/${portfolioId}/cagr`)
      .then(res => res.json())
      .then(setCagrData)
      .catch(err => setError("Failed to load CAGR data"));
  }, [portfolioId]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!metrics || !cagrData) return <p className="text-gray-500">Loading performance metrics...</p>;

  const totalAssets = metrics.holdings?.length || 0;
  const avgInvestment = totalAssets > 0 ? metrics.total_invested / totalAssets : 0;

  return (
    <div className="bg-white p-6 rounded shadow w-full">
      <h2 className="text-xl font-semibold mb-4">Portfolio Performance Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
        <div>
          <p><strong>Total Invested:</strong> ${metrics.total_invested.toFixed(2)}</p>
          <p><strong>Total Assets:</strong> {totalAssets}</p>
          <p><strong>Average Investment per Asset:</strong> ${avgInvestment.toFixed(2)}</p>
        </div>
        <div>
          <p><strong>Portfolio Value:</strong> ${cagrData.portfolio_value?.toFixed(2)}</p>
          <p><strong>CAGR:</strong> {cagrData.cagr?.toFixed(2)}%</p>
          <p className="text-sm text-gray-500">Over {cagrData.years} years</p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPerformance;
