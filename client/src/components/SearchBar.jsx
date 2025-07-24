import React, { useState } from 'react';
import AssetCard from './AssetCard';

const SearchBar = () => {
    const [ticker, setTicker] = useState('');
    const [submittedTicker, setSubmittedTicker] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (ticker.trim()) {
            setSubmittedTicker(ticker.trim().toUpperCase());
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 mt-10">
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

            {submittedTicker && <AssetCard ticker={submittedTicker} />}
        </div>
    )
}

export default SearchBar;