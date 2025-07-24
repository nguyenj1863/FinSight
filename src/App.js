import React from 'react';
import AssetCard from './components/AssetCard';

function App() {
  return (
    <div className="flex justify-center mt-10">
      <AssetCard ticker="AAPL" />
    </div>
  );
}

export default App;
