import React, { useEffect, useState } from 'react';

const AssetCard = ({ ticker }) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!ticker) return;

        fetch(`http://localhost:5000/api/asset/${ticker}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) throw new Error(data.error);
            setData(data);
        })
        .catch(err => setError(err.message));
    }, [ticker]);

    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
    if (!data) return <div className="p-4">Loading {ticker}...</div>;

    return (
        <div className='border rounded-x1 shadow-md p-6 max-w-sm bg-white'>
            <h2 className="text-x1 font-bold mb-2">{data.shortName || data.symbol}</h2>
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
    )
}

export default AssetCard;