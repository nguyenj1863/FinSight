import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#A28EFF', '#FF6492', '#40DFEF', '#FFD6E0'
];

const SectorPieChart = ({ portfolioId }) => {
    const [data, setData] = useState([]);
    const [totalValue, setTotalValue] = useState(0);

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
            setTotalValue(formatted.reduce((acc, { value }) => acc + value, 0)); // Calculate total sum
            setData(formatted);
          }
        })
        .catch(console.error);
    }, [portfolioId]);

    if (!data.length) return <p className="text-gray-500">No sector data available.</p>;

    // Custom Tooltip component
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
          const { name, value } = payload[0];
          const percent = (value / totalValue) * 100; // Manually calculate percent
          return (
            <div className="bg-white border rounded px-3 py-2 shadow text-sm">
              <p><strong>{name}</strong></p>
              <p>Value: ${value.toFixed(2)}</p>
              <p>Percentage: {percent.toFixed(1)}%</p>
            </div>
          );
        }
        return null;
    };

    const renderLabelLine = (props) => {
      const { x, y, cx, cy, outerRadius, midAngle } = props;
      const RADIAN = Math.PI / 180;
      const sin = Math.sin(-RADIAN * midAngle);
      const cos = Math.cos(-RADIAN * midAngle);
      const sx = cx + outerRadius * cos;
      const sy = cy + outerRadius * sin;
      const ex = cx + (outerRadius + 20) * cos; // <-- 20 is line extension length
      const ey = cy + (outerRadius + 20) * sin;

      return (
        <path
          d={`M${sx},${sy}L${ex},${ey}`}
          stroke="#333"
          fill="none"
        />
      );
    };


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
                        label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                        labelLine={renderLabelLine}
                    >
                        {data.map((entry, index) => (
                            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={20} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SectorPieChart;
