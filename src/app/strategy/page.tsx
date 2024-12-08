import StrategyBuilder from '@/components/strategy/StrategyBuilder';

export default function StrategyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-6">策略构建器</h1>
        <StrategyBuilder />
      </div>
    </div>
  );
} 