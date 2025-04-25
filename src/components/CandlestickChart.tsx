
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import ApexCharts from 'apexcharts';
import { cn } from '@/lib/utils';

interface CandlestickChartProps {
  data: Array<{
    x: Date;
    y: number[];
  }>;
  className?: string;
}

export const CandlestickChart = ({ data, className }: CandlestickChartProps) => {
  useEffect(() => {
    const options = {
      chart: {
        type: 'candlestick',
        height: 450,
        background: 'transparent',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
      },
      series: [{
        name: 'Stock Price',
        data: data
      }],
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            colors: '#6b7280',
          },
        },
      },
      yaxis: {
        tooltip: {
          enabled: true
        },
        labels: {
          style: {
            colors: '#6b7280',
          },
        },
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#10B981',
            downward: '#EF4444'
          }
        }
      },
      theme: {
        mode: 'light',
      }
    };

    const chart = new ApexCharts(document.querySelector("#candlestickChart"), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [data]);

  return (
    <Card className={cn("p-6 mt-8 backdrop-blur-xl bg-white/80 border border-gray-200/50 shadow-xl", className)}>
      <div id="candlestickChart" />
    </Card>
  );
};
