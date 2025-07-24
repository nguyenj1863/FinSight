import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addToWatchList,
    removeFromWatchlist,
} from '../redux/portfolioSlice'; // update this import path based on your structure
import AssetCard from './AssetCard';

const SearchBar = () => {
    const [ticker, setTicker] = useState('');
    const dispatch = useDispatch();
    const watchlist = useSelector((state) => state.portfolio.watchlist); // assuming 'portfolio' is the slice name

    const handleSubmit = (e) => {
        e.preventDefault();
        const formatted = ticker.trim().toUpperCase();
        if (!formatted || watchlist.includes(formatted)) return;
        dispatch(addToWatchList(formatted));
        setTicker('');
    };

    const handleRemove = (symbol) => {
        dispatch(removeFromWatchlist(symbol));
    };

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
    );
};

export default SearchBar;
