
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BarChartIcon, LineChart, AreaChart } from 'lucide-react';

// We need to add this dependency
import ApexCharts from 'apexcharts';

interface ChartProps {
  data: Array<{
    x: Date;
    y: number[];
  }>;
  className?: string;
}

type ChartType = 'bar' | 'line' | 'area';

export const CandlestickChart = ({ data, className }: ChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartType, setChartType] = useState<ChartType>('bar');
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Process data for different chart types
    const processedData = data.map(item => {
      return {
        x: item.x,
        y: chartType === 'bar' ? item.y : item.y[3], // For line/area charts, use the close price
      };
    });
    
    const options = {
      chart: {
        type: chartType,
        height: 450,
        background: 'transparent',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
          },
          autoSelected: 'zoom'
        },
        foreColor: '#9ca3af',
      },
      theme: {
        mode: 'dark',
      },
      series: [{
        name: chartType === 'bar' ? 'Stock Price' : 'Close Price',
        data: chartType === 'bar' ? data : processedData
      }],
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            colors: '#9ca3af',
          },
        },
      },
      yaxis: {
        tooltip: {
          enabled: true
        },
        labels: {
          style: {
            colors: '#9ca3af',
          },
        },
      },
      plotOptions: chartType === 'bar' ? {
        bar: {
          colors: {
            upward: '#10B981',
            downward: '#EF4444'
          }
        }
      } : {},
      fill: chartType === 'area' ? {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: ['#818cf8'],
          inverseColors: false,
          opacityFrom: 0.7,
          opacityTo: 0.3,
        }
      } : {},
      stroke: {
        curve: 'smooth',
        width: chartType === 'bar' ? 1 : 2,
      },
      colors: chartType !== 'bar' ? ['#6366f1'] : undefined,
      grid: {
        borderColor: '#334155',
        strokeDashArray: 2,
      },
      tooltip: {
        theme: 'dark',
      }
    };

    const chartElement = chartRef.current;
    // Clear any existing charts
    chartElement.innerHTML = '';
    
    // Create new chart
    const chart = new ApexCharts(chartElement, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [data, chartType]);

  return (
    <Card className={cn("p-6 mt-8 backdrop-blur-xl bg-gray-900/90 border border-gray-700/50 shadow-xl text-gray-100", className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
          Stock Chart
        </h2>
        <div className="flex space-x-2">
          <Button 
            variant={chartType === 'bar' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setChartType('bar')}
            className={chartType === 'bar' ? "bg-indigo-600 hover:bg-indigo-700" : "border-gray-700 text-gray-300"}
          >
            <BarChartIcon className="h-4 w-4 mr-1" />
            Bar
          </Button>
          <Button 
            variant={chartType === 'line' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setChartType('line')}
            className={chartType === 'line' ? "bg-indigo-600 hover:bg-indigo-700" : "border-gray-700 text-gray-300"}
          >
            <LineChart className="h-4 w-4 mr-1" />
            Line
          </Button>
          <Button 
            variant={chartType === 'area' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setChartType('area')}
            className={chartType === 'area' ? "bg-indigo-600 hover:bg-indigo-700" : "border-gray-700 text-gray-300"}
          >
            <AreaChart className="h-4 w-4 mr-1" />
            Area
          </Button>
        </div>
      </div>
      <div id="stockChart" ref={chartRef} />
    </Card>
  );
};
