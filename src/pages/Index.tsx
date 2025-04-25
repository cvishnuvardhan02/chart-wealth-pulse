import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { StockChart } from '@/components/StockChart';
import { CandlestickChart } from '@/components/CandlestickChart';
import { NewsCard } from '@/components/NewsCard';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, ChartBar, Brain, HelpCircle } from 'lucide-react';
import { StockQuiz } from '@/components/StockQuiz';
import { StockChatbot } from '@/components/StockChatbot';
import { BeginnerGuide } from '@/components/BeginnerGuide';

const API_KEY = "cvtobvhr01qjg135bp5gcvtobvhr01qjg135bp60";
const ALPHA_VANTAGE_API_KEY = "N5P8LHI5XRGN63C1";

const Index = () => {
  const { toast } = useToast();
  const [ticker, setTicker] = useState('');
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    prices: [] as number[],
    sma: [] as number[],
    ema: [] as number[],
  });
  const [candlestickData, setCandlestickData] = useState([]);
  const [news, setNews] = useState([]);
  const [userBalance, setUserBalance] = useState(100000);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [purchasedPrice, setPurchasedPrice] = useState(0);
  const [invested, setInvested] = useState(0);
  const [activeTab, setActiveTab] = useState('trade');

  useEffect(() => {
    if (!ticker) return;

    const intervalId = setInterval(async () => {
      await updateChartData();
      await fetchNews();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [ticker]);

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
      const quoteRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${API_KEY}`);
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
      const quoteRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${API_KEY}`);
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

  const updateChartData = async () => {
    if (!ticker) return;

    const now = Math.floor(Date.now() / 1000);
    const fiveMinutesAgo = now - 300;

    try {
      const [quoteRes, smaRes, emaRes] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${API_KEY}`).then(r => r.json()),
        fetch(`https://finnhub.io/api/v1/indicator?symbol=${ticker}&resolution=1&from=${fiveMinutesAgo}&to=${now}&indicator=sma&timeperiod=5&token=${API_KEY}`).then(r => r.json()),
        fetch(`https://finnhub.io/api/v1/indicator?symbol=${ticker}&resolution=1&from=${fiveMinutesAgo}&to=${now}&indicator=ema&timeperiod=5&token=${API_KEY}`).then(r => r.json())
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
      
      fetchCandlestickData(ticker);
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
      const res = await fetch(`https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${from}&to=${today}&token=${API_KEY}`);
      const newsData = await res.json();
      setNews(newsData.slice(0, 5));
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchCandlestickData = async (ticker: string) => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
      
      const mockData = [];
      let currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const basePrice = 100 + Math.random() * 50;
        const volatility = 5;
        
        const open = basePrice + (Math.random() - 0.5) * volatility;
        const high = open + Math.random() * volatility;
        const low = open - Math.random() * volatility;
        const close = low + Math.random() * (high - low);
        
        mockData.push({
          x: new Date(currentDate),
          y: [open, high, low, close]
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setCandlestickData(mockData);
    } catch (error) {
      console.error("Error generating candlestick data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-inter">
      <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fadeIn">
        <header className="text-center">
          <h1 className="text-4xl font-bold font-montserrat bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text mb-2">
            Stock Market Analytics
          </h1>
          <p className="text-gray-400">Real-time market insights and trading</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 bg-gray-800 p-1">
            <TabsTrigger value="trade" className="data-[state=active]:bg-indigo-700 text-gray-300">
              <ChartBar className="h-4 w-4 mr-2" />
              Trade
            </TabsTrigger>
            <TabsTrigger value="learn" className="data-[state=active]:bg-indigo-700 text-gray-300">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="quiz" className="data-[state=active]:bg-indigo-700 text-gray-300">
              <Brain className="h-4 w-4 mr-2" />
              Quiz
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-indigo-700 text-gray-300">
              <HelpCircle className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trade" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Input
                placeholder="Stock Ticker (e.g. AAPL)"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                className="md:col-span-2 bg-gray-800 border-gray-700 text-gray-200 focus:border-indigo-500"
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
              <Button 
                onClick={startTracking} 
                className="md:col-span-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Start Tracking
              </Button>
            </div>

            <StockChart data={chartData} ticker={ticker} showSMA={showSMA} showEMA={showEMA} />

            {ticker && <CandlestickChart data={candlestickData} />}

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
                  className="md:col-span-1 bg-gray-800 border-gray-700 text-gray-200"
                />
                <Button onClick={investInStock} className="bg-emerald-600 hover:bg-emerald-700">
                  Invest
                </Button>
                <Button onClick={sellStock} variant="destructive">
                  Sell
                </Button>
              </div>
              {invested > 0 && (
                <p className="text-sm text-gray-400 mt-4">
                  Currently invested: ₹{invested} at ₹{purchasedPrice.toFixed(2)}
                </p>
              )}
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold font-montserrat text-gray-200 bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                Latest News
              </h2>
              <div className="grid gap-4">
                {news.map((article, index) => (
                  <NewsCard key={index} article={article} />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="learn" className="mt-6">
            <BeginnerGuide />
          </TabsContent>
          
          <TabsContent value="quiz" className="mt-6">
            <StockQuiz />
          </TabsContent>
          
          <TabsContent value="chat" className="mt-6">
            <StockChatbot />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
