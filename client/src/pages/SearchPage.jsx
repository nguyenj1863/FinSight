import React from 'react';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';

function SearchPage() {
  const navigate = useNavigate();

  const goToPortfolio = () => {
    navigate('/portfolio/1');  // or dynamically based on user
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Search for Stocks</h1>
      <SearchBar />

      <button
        onClick={goToPortfolio}
        className="mt-8 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Go to Portfolio Dashboard
      </button>
    </div>
  );
}

export default SearchPage;
