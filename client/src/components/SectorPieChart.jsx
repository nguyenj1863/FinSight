import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#A28EFF', '#FF6492', '#40DFEF', '#FFD6E0'
];

const SectorPieChart = ({ portfolioId }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/api/portfolio/${portfolioId}/breakdown`)
        .then(res => res.json())
        .then(res => {
          if (res.sector_allocation) {
            const formatted = Object.entries(res.sector_allocation)
              .filter(([sector, value]) => sector && typeof value === 'number') // Filter bad data
              .map(([sector, value]) => ({
                name: sector,
                value: value,
            }));
          setData(formatted);
        }
      })
      .catch(console.error);
  }, [portfolioId]);

  if (!data.length) return <p className="text-gray-500">No sector data available.</p>;

  return (
    <div className="w-full h-96 p-4 bg-white shadow rounded">
      <h3 className="text-lg font-bold mb-4">Sector Allocation</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SectorPieChart;