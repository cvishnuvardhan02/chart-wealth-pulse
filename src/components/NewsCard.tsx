
import { Card } from '@/components/ui/card';

interface NewsCardProps {
  article: {
    headline: string;
    summary: string;
    url: string;
    datetime: number;
  };
}

export const NewsCard = ({ article }: NewsCardProps) => {
  return (
    <Card className="p-6 hover:scale-[1.02] transition-all duration-300 backdrop-blur-xl bg-white/80 border border-gray-200/50 shadow-lg">
      <h3 className="text-lg font-semibold font-montserrat text-indigo-600 mb-2">{article.headline}</h3>
      <p className="text-sm text-gray-600 font-inter mb-3">{article.summary || "No summary available."}</p>
      <div className="flex justify-between items-center">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-indigo-500 hover:text-indigo-600 font-medium transition-colors duration-200"
        >
          Read more →
        </a>
        <span className="text-xs text-gray-400">
          {new Date(article.datetime * 1000).toLocaleDateString()}
        </span>
      </div>
    </Card>
  );
};
