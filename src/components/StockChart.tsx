
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Chart from 'chart.js/auto';
import { motion } from 'framer-motion';

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
  chartType?: 'line' | 'bar' | 'area';
}

export const StockChart = ({ 
  data, 
  ticker, 
  showSMA, 
  showEMA, 
  className,
  chartType = 'line' 
}: StockChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Update current price and change
    if (data.prices && data.prices.length > 0) {
      const latest = data.prices[data.prices.length - 1];
      const previous = data.prices.length > 1 ? data.prices[data.prices.length - 2] : latest;
      setCurrentPrice(latest);
      setPriceChange(latest - previous);
    }

    const fill = chartType === 'area';

    chartInstance.current = new Chart(ctx, {
      type: chartType === 'bar' ? 'bar' : 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: `${ticker} Price`,
            data: data.prices,
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: chartType === 'bar' 
              ? 'rgba(99, 102, 241, 0.7)'
              : 'rgba(99, 102, 241, 0.1)',
            fill,
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
  }, [data, ticker, showSMA, showEMA, chartType]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn("p-6 backdrop-blur-xl bg-gray-900/90 border border-gray-700/50 shadow-xl text-gray-100", className)}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
            Real-Time Price: {ticker}
          </h2>
          {currentPrice && (
            <motion.div 
              className="flex flex-col items-end"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="text-xl font-bold">${currentPrice.toFixed(2)}</span>
              <span className={cn(
                "text-sm",
                priceChange >= 0 ? "text-green-400" : "text-red-400"
              )}>
                {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)} 
                ({priceChange >= 0 ? "+" : ""}{(priceChange / (currentPrice - priceChange) * 100).toFixed(2)}%)
              </span>
            </motion.div>
          )}
        </div>
        <canvas ref={chartRef} height="120" />
      </Card>
    </motion.div>
  );
};
