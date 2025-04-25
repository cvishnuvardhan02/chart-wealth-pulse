
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockChatbotProps {
  className?: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export const StockChatbot = ({ className }: StockChatbotProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm your Stock Market Assistant. How can I help you with stocks today?", sender: 'bot' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = { id: Date.now(), text: input, sender: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      const botResponse = { id: Date.now() + 1, text: generateResponse(input), sender: 'bot' as const };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (query: string) => {
    // Simple keyword-based response system
    query = query.toLowerCase();
    
    if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
      return "Hello! How can I assist you with stock market information today?";
    }
    
    if (query.includes('what is a stock')) {
      return "A stock represents partial ownership in a company. When you buy a stock, you're purchasing a small piece of that company, which entitles you to a proportion of its assets and earnings.";
    }
    
    if (query.includes('how to invest') || query.includes('start investing')) {
      return "To start investing in stocks, you'll need to: 1) Open a brokerage account, 2) Research companies you're interested in, 3) Determine your investment goals and risk tolerance, 4) Consider starting with index funds for diversification, and 5) Only invest money you can afford to keep in the market for at least 3-5 years.";
    }
    
    if (query.includes('dividend')) {
      return "Dividends are payments made by a corporation to its shareholders, usually as a distribution of profits. They're typically paid quarterly and can provide a steady income stream for investors.";
    }
    
    if (query.includes('bull market')) {
      return "A bull market is a period when stock prices are rising or expected to rise, typically characterized by optimism, investor confidence, and expectations of strong results. Historically, bull markets tend to last longer than bear markets.";
    }
    
    if (query.includes('bear market')) {
      return "A bear market occurs when stock prices fall by 20% or more from recent highs, often accompanied by negative investor sentiment and declining economic prospects. Bear markets can be triggered by economic recessions, pandemics, or other significant events affecting market confidence.";
    }
    
    if (query.includes('p/e ratio') || query.includes('pe ratio')) {
      return "The Price-to-Earnings (P/E) ratio is a valuation metric that compares a company's stock price to its earnings per share. A high P/E might indicate that investors expect high growth in the future, while a low P/E might suggest the company is undervalued or experiencing problems.";
    }
    
    if (query.includes('etf')) {
      return "An Exchange-Traded Fund (ETF) is a type of investment fund that trades on stock exchanges like individual stocks. ETFs hold assets such as stocks, bonds, or commodities and generally operate with an arbitrage mechanism to keep trading close to its net asset value. They offer diversification, lower costs, and tax efficiency compared to many mutual funds.";
    }
    
    if (query.includes('diversification')) {
      return "Diversification is a risk management strategy that mixes a wide variety of investments within a portfolio. The rationale is that a portfolio constructed of different kinds of assets will, on average, yield higher long-term returns and lower the risk of any individual holding or security.";
    }
    
    if (query.includes('index fund')) {
      return "An index fund is a type of mutual fund or ETF that is designed to track a specific market index, such as the S&P 500. These funds provide broad market exposure, low operating expenses, and low portfolio turnover, making them an excellent choice for many investors seeking a passive investment strategy.";
    }
    
    if (query.includes('volatility')) {
      return "Volatility measures how much the price of a security fluctuates over time. High volatility means prices change dramatically in short time periods, which can represent higher risk but also potential for higher returns. Low volatility suggests more stable and predictable price movements.";
    }
    
    if (query.includes('short selling') || query.includes('shorting')) {
      return "Short selling is an investment strategy where an investor borrows shares and immediately sells them, hoping to buy them back later at a lower price before returning them to the lender. It's essentially a bet that a stock's price will decline, but carries significant risk if prices rise instead.";
    }
    
    if (query.includes('market cap') || query.includes('market capitalization')) {
      return "Market capitalization is the total value of a company's outstanding shares of stock. It's calculated by multiplying the current stock price by the total number of shares outstanding. Companies are often categorized by market cap as large-cap, mid-cap, or small-cap, which can indicate different levels of risk and growth potential.";
    }
    
    if (query.includes('thank')) {
      return "You're welcome! Feel free to ask if you have any other questions about stocks or investing.";
    }
    
    return "I don't have specific information on that topic. Would you like to know about basic stock concepts, investing strategies, or market terminology?";
  };

  return (
    <Card className={cn("flex flex-col h-[500px] p-4 backdrop-blur-xl bg-gray-900/90 border border-gray-700/50 shadow-xl text-gray-200", className)}>
      <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">Stock Market Assistant</h2>
      
      <div className="flex-1 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 pr-2">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "max-w-[80%] rounded-lg p-3",
                msg.sender === 'user'
                  ? "bg-indigo-600/70 ml-auto rounded-tr-none"
                  : "bg-gray-700/70 mr-auto rounded-tl-none"
              )}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          ))}
          {isTyping && (
            <div className="bg-gray-700/70 max-w-[80%] rounded-lg p-3 rounded-tl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about stocks, investing, or market terms..."
          className="flex-1 bg-gray-800 border-gray-700 focus:ring-indigo-500 text-white"
        />
        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
          <SendIcon className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
};
