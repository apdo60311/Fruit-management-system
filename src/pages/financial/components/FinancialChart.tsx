import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, Card, CardContent, Typography } from '@mui/material';
import useFinancialStore from '../../../stores/financialStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FinancialChartProps {
  type: 'revenue' | 'expenses' | 'cashflow';
  title: string;
  period?: 'daily' | 'weekly' | 'monthly';
}

function FinancialChart({ type, title, period = 'monthly' }: FinancialChartProps) {
  const { transactions } = useFinancialStore();

  const getChartData = () => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    const monthlyData = new Array(12).fill(0);
    
    transactions
      .filter(t => {
        const transactionYear = new Date(t.date).getFullYear();
        return transactionYear === currentYear && t.status === 'completed';
      })
      .forEach(t => {
        const month = new Date(t.date).getMonth();
        if (type === 'revenue' && t.type === 'credit') {
          monthlyData[month] += t.amount;
        } else if (type === 'expenses' && t.type === 'debit') {
          monthlyData[month] += t.amount;
        } else if (type === 'cashflow') {
          monthlyData[month] += t.type === 'credit' ? t.amount : -t.amount;
        }
      });

    return {
      labels,
      datasets: [
        {
          label: title,
          data: monthlyData,
          borderColor: type === 'revenue' ? '#10B981' : type === 'expenses' ? '#EF4444' : '#3B82F6',
          backgroundColor: `${type === 'revenue' ? '#10B98120' : type === 'expenses' ? '#EF444420' : '#3B82F620'}`,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: (value: any) => {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
            }).format(value);
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Card elevation={0}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ height: 300 }}>
          <Line data={getChartData()} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
}

export default FinancialChart;