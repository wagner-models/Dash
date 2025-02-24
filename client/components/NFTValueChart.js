import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import Chart from 'chart.js/auto';

const NFTValueChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    // Mock data - replace with real data from your analytics service
    const mockData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Portfolio Value (SOL)',
          data: [10, 12, 15, 14, 18, 20],
          borderColor: 'purple',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(128, 90, 213, 0.1)'
        }
      ]
    };

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: mockData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'NFT Portfolio Value'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Value (SOL)'
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <Box w="full" h="400px">
      <canvas ref={chartRef} />
    </Box>
  );
};

export default NFTValueChart; 