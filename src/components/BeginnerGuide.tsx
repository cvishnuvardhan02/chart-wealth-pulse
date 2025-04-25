
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BeginnerGuideProps {
  className?: string;
}

export const BeginnerGuide = ({ className }: BeginnerGuideProps) => {
  const [openFAQs, setOpenFAQs] = useState<Record<string, boolean>>({});

  const toggleFAQ = (id: string) => {
    setOpenFAQs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card className={cn("p-6 backdrop-blur-xl bg-gray-900/90 border border-gray-700/50 shadow-xl text-gray-100", className)}>
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
        Stock Market: Beginner's Guide
      </h2>

      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 bg-gray-800">
          <TabsTrigger value="basics" className="data-[state=active]:bg-indigo-700">Stock Basics</TabsTrigger>
          <TabsTrigger value="investing" className="data-[state=active]:bg-indigo-700">How to Invest</TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-indigo-700">Analysis Tools</TabsTrigger>
        </TabsList>
        
        {/* Stock Basics Tab */}
        <TabsContent value="basics" className="space-y-5">
          <section className="space-y-3">
            <h3 className="text-xl font-semibold">What Are Stocks?</h3>
            <p className="text-gray-300">
              Stocks represent ownership shares in a company. When you buy a stock, you're purchasing a small piece of that 
              company, which entitles you to a proportion of its assets and earnings. Companies sell shares to raise capital 
              for growth, research, or other operations.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Key Stock Market Terminology</h3>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li><span className="font-semibold">Share:</span> A single unit of ownership in a company</li>
              <li><span className="font-semibold">Dividend:</span> A portion of company profits paid to shareholders</li>
              <li><span className="font-semibold">Bull Market:</span> A market period when prices are rising or expected to rise</li>
              <li><span className="font-semibold">Bear Market:</span> A market period when prices are falling or expected to fall</li>
              <li><span className="font-semibold">Volume:</span> The number of shares traded during a given time period</li>
              <li><span className="font-semibold">Market Cap:</span> Total value of a company's outstanding shares</li>
              <li><span className="font-semibold">P/E Ratio:</span> Stock price divided by earnings per share</li>
              <li><span className="font-semibold">Blue-Chip Stocks:</span> Shares of well-established, financially sound companies</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Stock Exchanges</h3>
            <p className="text-gray-300">
              Stock exchanges are regulated marketplaces where stocks are bought and sold. Major global exchanges include:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li><span className="font-semibold">NYSE (New York Stock Exchange):</span> The world's largest exchange by market capitalization</li>
              <li><span className="font-semibold">NASDAQ:</span> Known for technology and growth stocks</li>
              <li><span className="font-semibold">LSE (London Stock Exchange):</span> One of Europe's oldest exchanges</li>
              <li><span className="font-semibold">TSE (Tokyo Stock Exchange):</span> Japan's largest exchange</li>
              <li><span className="font-semibold">BSE (Bombay Stock Exchange):</span> Asia's oldest stock exchange</li>
              <li><span className="font-semibold">NSE (National Stock Exchange):</span> India's leading stock exchange</li>
            </ul>
          </section>
        </TabsContent>
        
        {/* How to Invest Tab */}
        <TabsContent value="investing" className="space-y-5">
          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Getting Started</h3>
            <ol className="list-decimal pl-6 text-gray-300 space-y-3">
              <li>
                <p className="font-semibold">Set Clear Goals</p>
                <p>Define what you want to achieve with your investments - retirement savings, buying a home, education fund, etc.</p>
              </li>
              <li>
                <p className="font-semibold">Understand Your Risk Tolerance</p>
                <p>Evaluate how much risk you can handle based on your age, financial situation, and investment timeline.</p>
              </li>
              <li>
                <p className="font-semibold">Choose a Brokerage Account</p>
                <p>Select a platform to buy and sell stocks. Consider fees, user experience, research tools, and customer service.</p>
              </li>
              <li>
                <p className="font-semibold">Start with a Simple Portfolio</p>
                <p>Consider beginning with index funds or ETFs for diversification before selecting individual stocks.</p>
              </li>
              <li>
                <p className="font-semibold">Invest Consistently</p>
                <p>Use dollar-cost averaging by investing fixed amounts regularly to reduce the impact of volatility.</p>
              </li>
            </ol>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Investment Strategies</h3>
            <div className="space-y-3 text-gray-300">
              <div>
                <p className="font-semibold">Value Investing</p>
                <p>Looking for stocks trading below their intrinsic value, focusing on company fundamentals.</p>
              </div>
              <div>
                <p className="font-semibold">Growth Investing</p>
                <p>Focusing on companies with above-average growth potential, often trading at higher valuations.</p>
              </div>
              <div>
                <p className="font-semibold">Dividend Investing</p>
                <p>Building a portfolio of stocks that provide regular dividend payments for income.</p>
              </div>
              <div>
                <p className="font-semibold">Index Investing</p>
                <p>Buying funds that track market indexes like the S&P 500 for broad market exposure.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Common Beginner Mistakes</h3>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Trying to time the market</li>
              <li>Not diversifying enough</li>
              <li>Investing money you can't afford to lose</li>
              <li>Making emotional decisions based on market news</li>
              <li>Neglecting to regularly review your portfolio</li>
              <li>Expecting unrealistic returns</li>
              <li>Not having an investment plan or strategy</li>
            </ul>
          </section>
        </TabsContent>
        
        {/* Analysis Tools Tab */}
        <TabsContent value="analysis" className="space-y-5">
          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Fundamental Analysis</h3>
            <p className="text-gray-300">
              Fundamental analysis evaluates a company's intrinsic value by examining related economic, financial, and other factors.
            </p>
            <div className="space-y-3 text-gray-300">
              <p className="font-semibold">Key Financial Statements:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><span className="italic">Income Statement</span> - Shows revenue, expenses, and profit</li>
                <li><span className="italic">Balance Sheet</span> - Lists assets, liabilities, and shareholder equity</li>
                <li><span className="italic">Cash Flow Statement</span> - Tracks cash movements into and out of the company</li>
              </ul>
              
              <p className="font-semibold mt-3">Important Ratios:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><span className="italic">P/E (Price-to-Earnings)</span> - Stock price relative to earnings</li>
                <li><span className="italic">P/B (Price-to-Book)</span> - Stock price relative to book value</li>
                <li><span className="italic">PEG (Price/Earnings-to-Growth)</span> - P/E ratio relative to earnings growth</li>
                <li><span className="italic">Debt-to-Equity</span> - Measures financial leverage</li>
                <li><span className="italic">ROE (Return on Equity)</span> - Measures profitability relative to equity</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Technical Analysis</h3>
            <p className="text-gray-300">
              Technical analysis evaluates investments by analyzing statistics generated by market activity, 
              like price movement and volume. It doesn't examine a company's financial health.
            </p>
            <div className="space-y-3 text-gray-300">
              <p className="font-semibold">Common Technical Indicators:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="italic">Moving Averages (MA)</span> - Show the average price over a specific period, 
                  smoothing out price fluctuations to identify trends
                </li>
                <li>
                  <span className="italic">Relative Strength Index (RSI)</span> - Measures speed and change of price movements, 
                  identifying overbought or oversold conditions
                </li>
                <li>
                  <span className="italic">MACD (Moving Average Convergence Divergence)</span> - Shows the relationship 
                  between two moving averages of a security's price
                </li>
                <li>
                  <span className="italic">Bollinger Bands</span> - Indicate volatility by creating a range around the moving average
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Chart Types</h3>
            <div className="space-y-3 text-gray-300">
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <p className="font-semibold">Line Charts</p>
                  <p>Simplest chart type, connecting closing prices over time. Good for seeing overall trends.</p>
                </li>
                <li>
                  <p className="font-semibold">Bar Charts</p>
                  <p>Show opening, high, low, and closing prices for each period. More detailed than line charts.</p>
                </li>
                <li>
                  <p className="font-semibold">Candlestick Charts</p>
                  <p>Similar to bar charts but with color-coding to show whether the price went up or down in that period.</p>
                </li>
                <li>
                  <p className="font-semibold">Area Charts</p>
                  <p>Like line charts, but with the area below the line filled in. Helpful for visualizing volume.</p>
                </li>
              </ul>
            </div>
          </section>
        </TabsContent>
      </Tabs>

      <section className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
        
        <div className="space-y-3">
          {[
            { 
              id: 'faq1', 
              question: 'How much money do I need to start investing?', 
              answer: 'You can start investing with almost any amount of money. Many brokers now offer fractional shares, allowing you to buy portions of expensive stocks. Some platforms let you start with as little as $1. The important thing is to begin investing consistently, regardless of the amount.' 
            },
            { 
              id: 'faq2', 
              question: 'Is it better to invest in individual stocks or funds?', 
              answer: 'For beginners, broad-market index funds or ETFs are often recommended as they provide instant diversification and lower risk. As you gain experience and knowledge, you might consider adding individual stocks to potentially increase returns, though with increased risk.' 
            },
            { 
              id: 'faq3', 
              question: 'How often should I check my investments?', 
              answer: 'For long-term investors, checking your portfolio too frequently can lead to emotional decisions. Quarterly reviews are typically sufficient for most investors. However, major life events or significant market changes might warrant additional reviews.' 
            },
            { 
              id: 'faq4', 
              question: 'What\'s the difference between stocks and bonds?', 
              answer: 'Stocks represent ownership in a company, while bonds are essentially loans to a company or government that pay fixed interest. Stocks typically offer higher potential returns but with higher risk, while bonds generally provide lower returns with less risk.' 
            },
            { 
              id: 'faq5', 
              question: 'How do I know when to sell a stock?', 
              answer: 'Consider selling when: your investment thesis no longer holds true, the company fundamentals have significantly deteriorated, you need the money, or you have better investment opportunities. Avoid selling solely based on short-term price movements or emotions.' 
            }
          ].map(faq => (
            <Collapsible
              key={faq.id}
              open={openFAQs[faq.id]}
              onOpenChange={() => toggleFAQ(faq.id)}
              className="border border-gray-700 rounded-lg overflow-hidden"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex justify-between items-center p-4 text-left bg-gray-800 hover:bg-gray-700 text-gray-100"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 transition-transform",
                      openFAQs[faq.id] && "transform rotate-180"
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 bg-gray-800/50 text-gray-300">
                {faq.answer}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </section>
    </Card>
  );
};
