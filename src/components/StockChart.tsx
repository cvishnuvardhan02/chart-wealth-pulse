
import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Chart from 'chart.js/auto';

interface StockChartProps {
  data: {
    labels: string[];
    prices: number[];
    sma: number[];
    ema: number[];
  };
  ticker: string;
  showSMA: boolean;
  showEMA: boolean;
  className?: string;
}

export const StockChart = ({ data, ticker, showSMA, showEMA, className }: StockChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: `${ticker} Live Price`,
            data: data.prices,
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'SMA (5)',
            data: data.sma,
            borderColor: 'rgb(249, 115, 22)',
            borderWidth: 1.5,
            borderDash: [5, 5],
            fill: false,
            hidden: !showSMA,
          },
          {
            label: 'EMA (5)',
            data: data.ema,
            borderColor: 'rgb(139, 92, 246)',
            borderWidth: 1.5,
            borderDash: [5, 2],
            fill: false,
            hidden: !showEMA,
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          duration: 750,
          easing: 'easeInOutQuart',
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              maxTicksLimit: 10,
              color: '#9ca3af',
            },
          },
          y: {
            grid: {
              color: 'rgba(55, 65, 81, 0.3)',
            },
            ticks: {
              color: '#9ca3af',
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: '#9ca3af',
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, ticker, showSMA, showEMA]);

  return (
    <Card className={cn("p-6 backdrop-blur-xl bg-gray-900/90 border border-gray-700/50 shadow-xl text-gray-100", className)}>
      <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
        Real-Time Price: {ticker}
      </h2>
      <canvas ref={chartRef} height="120" />
    </Card>
  );
};
