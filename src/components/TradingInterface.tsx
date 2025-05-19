
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { StockChart } from '@/components/StockChart';
import { NewsCard } from '@/components/NewsCard';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, BarChart, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

interface TradingInterfaceProps {
  className?: string;
}

export const TradingInterface = ({ className }: TradingInterfaceProps) => {
  const { toast } = useToast();
  const [ticker, setTicker] = useState('');
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    prices: [] as number[],
    sma: [] as number[],
    ema: [] as number[],
  });
  const [news, setNews] = useState([]);
  const [userBalance, setUserBalance] = useState(100000);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [purchasedPrice, setPurchasedPrice] = useState(0);
  const [invested, setInvested] = useState(0);

  useEffect(() => {
    if (!ticker) return;

    const intervalId = setInterval(async () => {
      await updateChartData();
      await fetchNews();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [ticker]);

  const updateChartData = async () => {
    if (!ticker) return;

    const now = Math.floor(Date.now() / 1000);
    const fiveMinutesAgo = now - 300;

    try {
      const [quoteRes, smaRes, emaRes] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=cvtobvhr01qjg135bp5gcvtobvhr01qjg135bp60`).then(r => r.json()),
        fetch(`https://finnhub.io/api/v1/indicator?symbol=${ticker}&resolution=1&from=${fiveMinutesAgo}&to=${now}&indicator=sma&timeperiod=5&token=cvtobvhr01qjg135bp5gcvtobvhr01qjg135bp60`).then(r => r.json()),
        fetch(`https://finnhub.io/api/v1/indicator?symbol=${ticker}&resolution=1&from=${fiveMinutesAgo}&to=${now}&indicator=ema&timeperiod=5&token=cvtobvhr01qjg135bp5gcvtobvhr01qjg135bp60`).then(r => r.json())
      ]);

      setChartData(prev => {
        const newLabels = [...prev.labels, new Date().toLocaleTimeString()];
        const newPrices = [...prev.prices, quoteRes.c];
        const newSma = [...prev.sma, smaRes.sma?.at(-1) || null];
        const newEma = [...prev.ema, emaRes.ema?.at(-1) || null];

        if (newLabels.length > 20) {
          newLabels.shift();
          newPrices.shift();
          newSma.shift();
          newEma.shift();
        }

        return {
          labels: newLabels,
          prices: newPrices,
          sma: newSma,
          ema: newEma,
        };
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stock data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchNews = async () => {
    if (!ticker) return;

    const today = new Date().toISOString().split("T")[0];
    const from = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    try {
      const res = await fetch(`https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${from}&to=${today}&token=cvtobvhr01qjg135bp5gcvtobvhr01qjg135bp60`);
      const newsData = await res.json();
      setNews(newsData.slice(0, 5));
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const startTracking = async () => {
    if (!ticker) {
      toast({
        title: "Error",
        description: "Please enter a stock ticker",
        variant: "destructive",
      });
      return;
    }

    setChartData({
      labels: [],
      prices: [],
      sma: [],
      ema: [],
    });

    await updateChartData();
    await fetchNews();
  };

  const investInStock = async () => {
    if (!ticker || !investmentAmount || parseFloat(investmentAmount) <= 0 || parseFloat(investmentAmount) > userBalance) {
      toast({
        title: "Error",
        description: "Please enter a valid investment amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const quoteRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=cvtobvhr01qjg135bp5gcvtobvhr01qjg135bp60`);
      const quoteData = await quoteRes.json();
      const amount = parseFloat(investmentAmount);

      setPurchasedPrice(quoteData.c);
      setInvested(amount);
      setUserBalance(prev => prev - amount);
      setInvestmentAmount('');

      toast({
        title: "Success",
        description: `Invested ₹${amount} in ${ticker}`,
      });
    } catch (error) {
      console.error('Error investing:', error);
      toast({
        title: "Error",
        description: "Failed to process investment",
        variant: "destructive",
      });
    }
  };

  const sellStock = async () => {
    if (!invested) {
      toast({
        title: "Error",
        description: "No active investments to sell",
        variant: "destructive",
      });
      return;
    }

    try {
      const quoteRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=cvtobvhr01qjg135bp5gcvtobvhr01qjg135bp60`);
      const quoteData = await quoteRes.json();
      const currentPrice = quoteData.c;
      const profitLoss = (currentPrice - purchasedPrice) * (invested / purchasedPrice);

      setUserBalance(prev => prev + invested + profitLoss);
      setInvested(0);
      setPurchasedPrice(0);

      toast({
        title: "Success",
        description: `Sold stock for ₹${profitLoss > 0 ? '+' : ''}${profitLoss.toFixed(2)} profit/loss`,
        variant: profitLoss > 0 ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Error selling:', error);
      toast({
        title: "Error",
        description: "Failed to process sale",
        variant: "destructive",
      });
    }
  };

  const handleSMAChange = (checked: boolean) => {
    setShowSMA(checked);
  };

  const handleEMAChange = (checked: boolean) => {
    setShowEMA(checked);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center"
      >
        <Input
          placeholder="Stock Ticker (e.g. AAPL)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          className="md:col-span-2 bg-gray-800/70 border-gray-700/50 text-gray-200 focus:border-indigo-500"
        />
        
        <div className="flex gap-4 md:col-span-1 text-gray-300">
          <div className="flex items-center space-x-2">
            <Checkbox id="sma" checked={showSMA} onCheckedChange={handleSMAChange} />
            <label htmlFor="sma" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              SMA
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="ema" checked={showEMA} onCheckedChange={handleEMAChange} />
            <label htmlFor="ema" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              EMA
            </label>
          </div>
        </div>
        
        <Select 
          value={chartType} 
          onValueChange={(value) => setChartType(value as 'line' | 'bar' | 'area')}
        >
          <SelectTrigger className="bg-gray-800/70 border-gray-700/50 text-gray-200">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
            <SelectItem value="line">
              <div className="flex items-center">
                <LineChart className="h-4 w-4 mr-2" />
                Line
              </div>
            </SelectItem>
            <SelectItem value="bar">
              <div className="flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                Bar
              </div>
            </SelectItem>
            <SelectItem value="area">
              <div className="flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Area
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          onClick={startTracking} 
          className="md:col-span-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          Start Tracking
        </Button>
      </motion.div>

      <StockChart 
        data={chartData} 
        ticker={ticker} 
        showSMA={showSMA} 
        showEMA={showEMA}
        chartType={chartType}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card className="p-6 backdrop-blur-xl bg-gray-900/90 border border-gray-700/50 shadow-xl text-gray-200">
          <h2 className="text-xl font-semibold font-montserrat mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
            Investment Overview
          </h2>
          <p className="text-lg text-gray-300 mb-4">Balance: ₹{userBalance.toFixed(2)}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="number"
              placeholder="Amount to invest"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              className="md:col-span-1 bg-gray-800/70 border-gray-700/50 text-gray-200"
            />
            <Button onClick={investInStock} className="bg-emerald-600 hover:bg-emerald-700">
              Invest
            </Button>
            <Button onClick={sellStock} variant="destructive">
              Sell
            </Button>
          </div>
          {invested > 0 && (
            <motion.p 
              className="text-sm text-gray-400 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Currently invested: ₹{invested} at ₹{purchasedPrice.toFixed(2)}
            </motion.p>
          )}
        </Card>
      </motion.div>

      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold font-montserrat text-gray-200 bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
          Latest News
        </h2>
        <div className="grid gap-4">
          {news.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * index + 0.8, duration: 0.4 }}
            >
              <NewsCard article={article} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
