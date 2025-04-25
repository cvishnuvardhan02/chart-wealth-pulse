
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

// Quiz questions database
const quizQuestions = [
  {
    id: 1,
    question: "What does P/E ratio stand for in stock analysis?",
    options: ["Price/Earnings", "Profit/Expense", "Potential/Equity", "Portfolio/Evaluation"],
    correctAnswer: "Price/Earnings",
    explanation: "Price-to-Earnings (P/E) ratio is a valuation metric that measures a company's current share price relative to its earnings per share. It helps investors determine if a stock is overvalued or undervalued."
  },
  {
    id: 2,
    question: "Which of these is NOT a common stock market index?",
    options: ["S&P 500", "NASDAQ", "FTSE 100", "WXYZ 50"],
    correctAnswer: "WXYZ 50",
    explanation: "S&P 500, NASDAQ, and FTSE 100 are all major stock market indices. The S&P 500 tracks 500 large US companies, NASDAQ focuses on tech stocks, and FTSE 100 tracks the top 100 companies on the London Stock Exchange."
  },
  {
    id: 3,
    question: "What is a stock market 'bear market'?",
    options: ["When stock prices rise by 20%+", "When stock prices fall by 20%+", "When trading volume increases significantly", "A market dominated by energy stocks"],
    correctAnswer: "When stock prices fall by 20%+",
    explanation: "A bear market occurs when stock prices fall by 20% or more from recent highs, typically over a period of at least two months. It usually signals pessimism and negative investor sentiment."
  },
  {
    id: 4,
    question: "What does 'dividend yield' represent?",
    options: ["Annual dividend payment as a percentage of stock price", "Company's total annual profit", "Growth rate of a company", "Amount of new shares issued"],
    correctAnswer: "Annual dividend payment as a percentage of stock price",
    explanation: "Dividend yield represents the annual dividend payment divided by the stock price, expressed as a percentage. It helps investors understand the return they're receiving from dividends relative to the price they paid for the stock."
  },
  {
    id: 5,
    question: "Which strategy involves purchasing shares at regular intervals regardless of price?",
    options: ["Market timing", "Day trading", "Dollar-cost averaging", "Short selling"],
    correctAnswer: "Dollar-cost averaging",
    explanation: "Dollar-cost averaging is an investment strategy where an investor divides the total amount to be invested across periodic purchases to reduce the impact of volatility. This method avoids the risk of investing all money at the wrong time."
  },
  {
    id: 6,
    question: "What term describes when a stock trades above its intrinsic value?",
    options: ["Undervalued", "Overvalued", "Blue-chip", "Dividend aristocrat"],
    correctAnswer: "Overvalued",
    explanation: "An overvalued stock trades at a price that exceeds its intrinsic value or true worth. This could happen due to excessive optimism about future growth, market hype, or industry trends that may not be sustainable."
  },
  {
    id: 7,
    question: "What is market capitalization?",
    options: ["The total dollar value of all outstanding shares", "Annual profit of a company", "Number of shares traded daily", "The company's debt level"],
    correctAnswer: "The total dollar value of all outstanding shares",
    explanation: "Market capitalization (or market cap) is calculated by multiplying the total number of outstanding shares by the current share price. It represents the total market value of a company's equity."
  },
  {
    id: 8,
    question: "Which of these is known as a defensive stock sector?",
    options: ["Technology", "Utilities", "Cryptocurrency", "Real estate"],
    correctAnswer: "Utilities",
    explanation: "Utility stocks are considered defensive because they provide essential services (water, electricity, gas) that remain in demand regardless of economic conditions, making them less volatile during market downturns."
  },
  {
    id: 9,
    question: "What does EPS stand for in financial analysis?",
    options: ["Earnings Per Share", "Economic Profit Strategy", "Equity Percentage Split", "Enhanced Portfolio Security"],
    correctAnswer: "Earnings Per Share",
    explanation: "Earnings Per Share (EPS) represents the portion of a company's profit allocated to each outstanding share of common stock. It serves as an indicator of a company's profitability."
  },
  {
    id: 10,
    question: "What is a stock split?",
    options: ["Dividing company ownership between partners", "Increasing the number of shares while decreasing price proportionally", "Selling part of a company to investors", "Removing poor performing stocks from a portfolio"],
    correctAnswer: "Increasing the number of shares while decreasing price proportionally",
    explanation: "A stock split increases the number of shares outstanding while decreasing the price per share proportionally. For example, in a 2-for-1 split, each share becomes two shares, each worth half the original value. The total market value remains unchanged."
  },
  {
    id: 11,
    question: "What is the primary purpose of a stock exchange?",
    options: ["To provide loans to companies", "To facilitate buying and selling of securities", "To set interest rates", "To create new currencies"],
    correctAnswer: "To facilitate buying and selling of securities",
    explanation: "Stock exchanges provide marketplaces where securities (stocks, bonds, etc.) can be bought and sold in a regulated, secure, and liquid environment. They help connect companies seeking capital with investors looking for investment opportunities."
  },
  {
    id: 12,
    question: "Which of these is NOT a common order type when trading stocks?",
    options: ["Market order", "Limit order", "Stop order", "Future order"],
    correctAnswer: "Future order",
    explanation: "Common order types include market orders (execute at current market price), limit orders (execute at specified price or better), and stop orders (become market orders when price reaches specified level). 'Future order' is not a standard stock order type."
  },
  {
    id: 13,
    question: "What is a blue-chip stock?",
    options: ["A new tech startup stock", "Stock of a well-established, financially stable company", "A highly volatile stock", "A stock priced under $5"],
    correctAnswer: "Stock of a well-established, financially stable company",
    explanation: "Blue-chip stocks are shares of large, well-established, and financially sound companies with excellent reputations. They typically have stable earnings, pay dividends consistently, and have been around for many years."
  },
  {
    id: 14,
    question: "What does 'shorting' a stock mean?",
    options: ["Buying a stock at a low price", "Selling borrowed shares with the hope of buying them back at a lower price", "Holding stocks for a short period", "Splitting a stock into smaller shares"],
    correctAnswer: "Selling borrowed shares with the hope of buying them back at a lower price",
    explanation: "Short selling involves borrowing shares and immediately selling them, hoping to buy them back later at a lower price before returning them to the lender. Profits are made if the stock price declines between the sale and repurchase."
  },
  {
    id: 15,
    question: "What is an ETF in the context of stock investments?",
    options: ["Electronic Trading Format", "Exchange-Traded Fund", "Equity Trading Framework", "Extended Term Financing"],
    correctAnswer: "Exchange-Traded Fund",
    explanation: "An Exchange-Traded Fund (ETF) is a type of investment fund that trades on stock exchanges like individual stocks. ETFs typically track an index, commodity, bonds, or a basket of assets, providing investors with diversification in a single investment vehicle."
  },
  {
    id: 16,
    question: "What is the difference between a bull market and a bear market?",
    options: ["Bull markets have higher trading volumes than bear markets", "Bull markets show rising prices while bear markets show falling prices", "Bull markets are in Asia, bear markets are in Europe", "Bull markets involve large companies, bear markets involve small companies"],
    correctAnswer: "Bull markets show rising prices while bear markets show falling prices",
    explanation: "A bull market is characterized by rising stock prices and optimistic investor sentiment, typically defined as a 20%+ increase from recent lows. A bear market shows falling prices (20%+ decline from recent highs) and pessimistic sentiment."
  },
  {
    id: 17,
    question: "Which of these metrics helps investors determine how quickly a company's inventory is sold?",
    options: ["Debt-to-equity ratio", "Price-to-book ratio", "Inventory turnover ratio", "Current ratio"],
    correctAnswer: "Inventory turnover ratio",
    explanation: "Inventory turnover ratio measures how many times a company sells and replaces its inventory during a period. A high ratio indicates efficient inventory management and strong sales, while a low ratio might suggest overstocking or obsolescence issues."
  },
  {
    id: 18,
    question: "What is a stock's 52-week range?",
    options: ["The difference between a company's highest and lowest earnings in a year", "The highest and lowest prices at which a stock has traded over the past 52 weeks", "The total number of shares traded in 52 weeks", "The company's annual revenue change"],
    correctAnswer: "The highest and lowest prices at which a stock has traded over the past 52 weeks",
    explanation: "A 52-week range shows the highest and lowest trading prices of a stock over the past year (52 weeks). Investors use this to assess volatility and to help determine if the current price is relatively high or low."
  },
  {
    id: 19,
    question: "What does ROI stand for in investment terminology?",
    options: ["Rate Of Interest", "Return On Investment", "Record Of Income", "Risk Of Inflation"],
    correctAnswer: "Return On Investment",
    explanation: "Return On Investment (ROI) measures the profitability of an investment relative to its cost. It's calculated by dividing the net profit of an investment by its cost, then multiplying by 100 to express it as a percentage."
  },
  {
    id: 20,
    question: "Which of these is NOT typically considered a growth sector?",
    options: ["Technology", "Utilities", "Healthcare", "Renewable Energy"],
    correctAnswer: "Utilities",
    explanation: "Utilities are typically considered defensive rather than growth sectors. They provide essential services with stable demand but limited growth potential. Technology, healthcare, and renewable energy are generally considered growth sectors with higher potential for expansion."
  },
  {
    id: 21,
    question: "What happens to a stock's price on the ex-dividend date?",
    options: ["It typically rises by the dividend amount", "It typically falls by the dividend amount", "It remains unchanged", "It doubles in value"],
    correctAnswer: "It typically falls by the dividend amount",
    explanation: "On the ex-dividend date, a stock's price typically drops by approximately the amount of the dividend payment. This occurs because anyone buying the stock on or after this date will not receive the upcoming dividend, making the stock less valuable by that amount."
  },
  {
    id: 22,
    question: "What is a stock's beta coefficient?",
    options: ["Its annual return percentage", "A measure of its volatility compared to the market", "Its debt-to-equity ratio", "The number of outstanding shares"],
    correctAnswer: "A measure of its volatility compared to the market",
    explanation: "Beta measures a stock's volatility in relation to the overall market. A beta of 1 means the stock moves with the market, above 1 means more volatile than the market, and below 1 means less volatile than the market."
  },
  {
    id: 23,
    question: "Which of these factors typically causes stock prices to rise?",
    options: ["Increasing interest rates", "Declining company earnings", "Positive economic growth", "Rising unemployment"],
    correctAnswer: "Positive economic growth",
    explanation: "Positive economic growth generally leads to higher corporate profits and investor confidence, which typically drives stock prices higher. Conversely, increasing interest rates, declining earnings, and rising unemployment often have negative effects on stock prices."
  },
  {
    id: 24,
    question: "What is a stock market correction?",
    options: ["A 10%+ drop from recent highs", "An adjustment to company financial statements", "When trading errors are fixed", "A complete market restart"],
    correctAnswer: "A 10%+ drop from recent highs",
    explanation: "A stock market correction is defined as a decline of 10% or more from recent highs. Corrections are normal market adjustments and are less severe than bear markets (which are 20%+ declines)."
  },
  {
    id: 25,
    question: "What is a company's 'float' in stock market terminology?",
    options: ["The company's total assets", "Shares available for public trading", "The current stock price", "Annual dividend payment"],
    correctAnswer: "Shares available for public trading",
    explanation: "Float refers to the number of shares actually available for trading by the public. It excludes restricted shares held by company insiders, major shareholders, and employees. A small float can make a stock more volatile as fewer shares are available to trade."
  },
  {
    id: 26,
    question: "What is a stock market index?",
    options: ["A list of all companies on an exchange", "A measure of the value of a section of the stock market", "The daily trading volume", "A company's ranking by market cap"],
    correctAnswer: "A measure of the value of a section of the stock market",
    explanation: "A stock market index is a measurement of the value of a section of the stock market. It is computed from the prices of selected stocks and is used as a tool to represent market performance and compare returns on specific investments."
  },
  {
    id: 27,
    question: "What does 'market sentiment' refer to?",
    options: ["Stock exchange rules and regulations", "The overall attitude of investors toward a particular security or financial market", "Daily trading volume", "Stock price movements"],
    correctAnswer: "The overall attitude of investors toward a particular security or financial market",
    explanation: "Market sentiment refers to the overall attitude or feeling that investors have about the market or a specific security. It's the psychology of market participants that can influence price action, regardless of the fundamentals."
  },
  {
    id: 28,
    question: "What is fundamental analysis in stock investing?",
    options: ["Analyzing stock price patterns on charts", "Evaluating a company's financial health, management, and competitive advantages", "Looking at short-term price movements", "Studying market sentiment indicators"],
    correctAnswer: "Evaluating a company's financial health, management, and competitive advantages",
    explanation: "Fundamental analysis involves examining a company's financial statements, management quality, competitive advantages, and industry conditions to determine its intrinsic value. It focuses on factors that could influence a company's value in the long term."
  },
  {
    id: 29,
    question: "What is the primary benefit of stock diversification?",
    options: ["Guaranteed positive returns", "Higher dividend payments", "Risk reduction", "Lower trading costs"],
    correctAnswer: "Risk reduction",
    explanation: "The primary benefit of diversification is risk reduction. By spreading investments across various stocks, sectors, or asset classes, investors can reduce the impact of poor performance from any single investment on the overall portfolio."
  },
  {
    id: 30,
    question: "Which of these best describes a 'value stock'?",
    options: ["A stock with rapidly increasing sales", "A stock trading at a discount to its intrinsic value", "A newly issued stock", "A stock with high dividend yield"],
    correctAnswer: "A stock trading at a discount to its intrinsic value",
    explanation: "A value stock is one that appears to trade at a lower price relative to its fundamentals (earnings, dividends, sales, etc.). Value investors believe these stocks are undervalued by the market and have potential for growth when the market recognizes their true worth."
  }
];

interface StockQuizProps {
  className?: string;
}

export const StockQuiz = ({ className }: StockQuizProps) => {
  const { toast } = useToast();
  const [currentQuestions, setCurrentQuestions] = useState<typeof quizQuestions>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    // Select 5 random questions from the database
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
    setCurrentQuestions(shuffled.slice(0, 5));
  }, []);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    if (answer === currentQuestions[currentQuestionIndex]?.correctAnswer) {
      setScore(prevScore => prevScore + 1);
      toast({
        title: "Correct!",
        description: "You selected the right answer.",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was: ${currentQuestions[currentQuestionIndex]?.correctAnswer}`,
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    // Select 5 new random questions
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
    setCurrentQuestions(shuffled.slice(0, 5));
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (currentQuestions.length === 0) {
    return <div>Loading quiz...</div>;
  }

  const currentQuestion = currentQuestions[currentQuestionIndex];

  return (
    <Card className={cn("p-6 backdrop-blur-xl bg-gray-900/90 border border-gray-700/50 shadow-xl text-gray-100", className)}>
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
        Stock Market Quiz
      </h2>
      
      {!quizCompleted ? (
        <div className="space-y-6">
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-1">Question {currentQuestionIndex + 1} of {currentQuestions.length}</p>
            <h3 className="text-xl font-semibold">{currentQuestion.question}</h3>
          </div>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !selectedAnswer && handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
                className={cn(
                  "w-full p-3 text-left rounded-lg transition-colors",
                  selectedAnswer === null
                    ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                    : selectedAnswer === option && option === currentQuestion.correctAnswer
                    ? "bg-green-900/50 border border-green-500"
                    : selectedAnswer === option
                    ? "bg-red-900/50 border border-red-500"
                    : option === currentQuestion.correctAnswer
                    ? "bg-green-900/50 border border-green-500"
                    : "bg-gray-800 border border-gray-700 opacity-70"
                )}
              >
                {option}
              </button>
            ))}
          </div>
          
          {showExplanation && (
            <div className="mt-4 p-4 bg-indigo-900/30 rounded-lg border border-indigo-800/50">
              <p className="text-gray-300 text-sm font-medium">{currentQuestion.explanation}</p>
            </div>
          )}
          
          <div className="flex justify-end">
            {showExplanation && (
              <Button 
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {currentQuestionIndex < currentQuestions.length - 1 ? "Next Question" : "See Results"}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-semibold">Quiz Completed!</h3>
          <div className="text-4xl font-bold text-center py-6">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
              {score} / {currentQuestions.length}
            </span>
          </div>
          <p className="text-gray-300">
            {score === currentQuestions.length
              ? "Perfect score! You really know your stocks!"
              : score >= currentQuestions.length / 2
              ? "Great job! You've got a solid understanding of the stock market."
              : "Keep learning! The stock market has many concepts to master."}
          </p>
          <Button 
            onClick={restartQuiz}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 mt-4"
          >
            Start New Quiz
          </Button>
        </div>
      )}
    </Card>
  );
};
