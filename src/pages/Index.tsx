
import { useState } from 'react';
import { TradingInterface } from '@/components/TradingInterface';
import { StockQuiz } from '@/components/StockQuiz';
import { StockChatbot } from '@/components/StockChatbot';
import { BeginnerGuide } from '@/components/BeginnerGuide';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartBar, BookOpen, Brain, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const [activeTab, setActiveTab] = useState('trade');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 font-inter">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto p-6 space-y-8"
      >
        <header className="text-center">
          <motion.h1 
            className="text-4xl font-bold font-montserrat bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text mb-2"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            Stock Market Analytics
          </motion.h1>
          <motion.p 
            className="text-gray-400"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Real-time market insights and trading
          </motion.p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <TabsList className="grid grid-cols-4 bg-gray-800/50 p-1 backdrop-blur-md border border-gray-700/30 rounded-xl">
              <TabsTrigger value="trade" className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white text-gray-300">
                <ChartBar className="h-4 w-4 mr-2" />
                Trade
              </TabsTrigger>
              <TabsTrigger value="learn" className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white text-gray-300">
                <BookOpen className="h-4 w-4 mr-2" />
                Learn
              </TabsTrigger>
              <TabsTrigger value="quiz" className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white text-gray-300">
                <Brain className="h-4 w-4 mr-2" />
                Quiz
              </TabsTrigger>
              <TabsTrigger value="chat" className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white text-gray-300">
                <HelpCircle className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
            </TabsList>
          </motion.div>
          
          <TabsContent value="trade" className="space-y-6 mt-6">
            <TradingInterface />
          </TabsContent>
          
          <TabsContent value="learn" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <BeginnerGuide />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="quiz" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StockQuiz />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="chat" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StockChatbot />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Index;
