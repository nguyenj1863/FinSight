import React, { useEffect, useState } from 'react';

const AssetCard = ({ ticker }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticker) return;

    setLoading(true);
    fetch(`http://localhost:5000/api/assets/${ticker}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setData(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [ticker]);

  if (loading) {
    return (
      <div className="p-6 max-w-sm bg-white border rounded-xl shadow-md animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-2/3 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="space-y-2 mt-4">
          {[...Array(5)].map((_,i) => (
            <div key={i} className="h-3 bg-gray-200 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="border rounded-xl shadow-md p-6 max-w-sm bg-white">
      <h2 className="text-xl font-bold mb-2">{data.shortName || data.symbol}</h2>
      <p className="text-gray-600 text-sm mb-4">{data.symbol} • {data.currency}</p>
      <ul className="space-y-1 text-sm">
        <li>Current Price: <strong>${data.currentPrice}</strong></li>
        <li>Day High: ${data.dayHigh}</li>
        <li>Day Low: ${data.dayLow}</li>
        <li>Market Cap: ${Number(data.marketCap).toLocaleString()}</li>
        <li>Previous Close: ${data.previousClose}</li>
        <li>Volume: {Number(data.volume).toLocaleString()}</li>
      </ul>
    </div>
  );
};

export default AssetCard;
