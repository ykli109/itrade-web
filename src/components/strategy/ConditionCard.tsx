import { StrategyCondition } from '@/types/strategy';

interface ConditionCardProps {
  condition: StrategyCondition;
  onUpdate: (params: Partial<StrategyCondition['params']>) => void;
  onRemove: () => void;
}

export default function ConditionCard({ condition, onUpdate, onRemove }: ConditionCardProps) {
  const renderFields = () => {
    switch (condition.type) {
      case 'price':
        return (
          <>
            <input
              type="number"
              placeholder="观察天数"
              className="p-2 border rounded"
              value={condition.params.days || ''}
              onChange={(e) => onUpdate({ days: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="涨幅百分比"
              className="p-2 border rounded"
              value={condition.params.percentage || ''}
              onChange={(e) => onUpdate({ percentage: Number(e.target.value) })}
            />
          </>
        );
      
      case 'volume':
        return (
          <>
            <input
              type="number"
              placeholder="观察天数"
              className="p-2 border rounded"
              value={condition.params.days || ''}
              onChange={(e) => onUpdate({ days: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="对比天数"
              className="p-2 border rounded"
              value={condition.params.compareDays || ''}
              onChange={(e) => onUpdate({ compareDays: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="量比"
              className="p-2 border rounded"
              value={condition.params.compareRatio || ''}
              onChange={(e) => onUpdate({ compareRatio: Number(e.target.value) })}
            />
          </>
        );
      
      case 'drawdown':
        return (
          <>
            <input
              type="number"
              placeholder="观察天数"
              className="p-2 border rounded"
              value={condition.params.days || ''}
              onChange={(e) => onUpdate({ days: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="最大回撤百分比"
              className="p-2 border rounded"
              value={condition.params.percentage || ''}
              onChange={(e) => onUpdate({ percentage: Number(e.target.value) })}
            />
          </>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700">
          {condition.type === 'price' && '价格条件'}
          {condition.type === 'volume' && '成交量条件'}
          {condition.type === 'drawdown' && '回撤条件'}
        </h3>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {renderFields()}
      </div>
    </div>
  );
} 