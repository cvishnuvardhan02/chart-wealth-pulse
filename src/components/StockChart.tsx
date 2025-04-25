
import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Chart, ChartType } from 'chart.js/auto';
import { cn } from '@/lib/utils';

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
      type: 'line' as ChartType,
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
              color: '#6b7280',
            },
          },
          y: {
            grid: {
              color: 'rgba(107, 114, 128, 0.1)',
            },
            ticks: {
              color: '#6b7280',
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: '#6b7280',
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
    <Card className={cn("p-6 backdrop-blur-xl bg-white/80 border border-gray-200/50 shadow-xl", className)}>
      <canvas ref={chartRef} height="120" />
    </Card>
  );
};
