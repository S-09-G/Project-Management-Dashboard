import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

const Analysis = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8082/analytics');
        const data = await response.json();
        const { totalRows, selectedRows } = data;

        setChartData({
          labels: ['Selected', 'Not Selected'],
          datasets: [
            {
              data: [selectedRows, totalRows - selectedRows],
              backgroundColor: ['#36A2EB', '#FF6384'],
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Analytics</h1>
      {chartData ? (
        <Pie data={chartData} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Analysis;
