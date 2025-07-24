import React, { useEffect, useState } from 'react';
import AssetCard from './AssetCard';

const SearchBar = () => {
    const [ticker, setTicker] = useState('');
    const [watchlist, setWatchlist] = useState([]);

    // Load from localaStorage
    useEffect(() => {
        const stored = localStorage.getItem('watchlist');
        if(stored) {
            setWatchlist(JSON.parse(stored));
        }
    }, []);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }, [watchlist]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formatted = ticker.trim().toUpperCase();
        if(!formatted || watchlist.includes(formatted)) return;
        setWatchlist((prev) => [...prev, formatted]);      
        setTicker('');
    };

    const handleRemove = (symbol) => {
        const updated = watchlist.filter((item) => item !== symbol);
        setWatchlist(updated);
    }

    return (
        <div className="flex flex-col items-center gap-6 mt-10 w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                    type="text"
                    placeholder="Enter stock ticker"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    className="border rounded-md p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Search
                </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full justify-items-center">
                {watchlist.map((symbol) => (
                    <div key={symbol} className="relative">
                        <AssetCard ticker={symbol} />
                        <button
                            onClick={() => handleRemove(symbol)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
                            title="remove from watchlist"
                    >
                        ❌
                    </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SearchBar;