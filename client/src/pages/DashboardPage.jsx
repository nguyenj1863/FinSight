import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SectorPieChart from '../components/SectorPieChart';
import PortfolioGrowthChart from '../components/PortfolioGrowthChart';
import TransactionTable from '../components/TransactionTable';
import CSVUpload from '../components/CSVUpload';

function DashboardPage() {
  const { id: portfolioId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Portfolio Dashboard</h1>
        <button
          onClick={() => navigate('/')}
          className="text-sm bg-gray-100 border px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          ← Back to Search
        </button>
      </div>

      <CSVUpload portfolioId={portfolioId} />
      <SectorPieChart portfolioId={portfolioId} />
      <PortfolioGrowthChart portfolioId={portfolioId} />
      <TransactionTable portfolioId={portfolioId} />
    </div>
  );
}

export default DashboardPage;
