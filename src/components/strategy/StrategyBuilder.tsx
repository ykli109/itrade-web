'use client';

import { useState } from 'react';
import { Strategy, StrategyCondition } from '@/types/strategy';
import ConditionCard from './ConditionCard';

export default function StrategyBuilder() {
  const [strategy, setStrategy] = useState<Strategy>({
    id: '',
    name: '',
    conditions: []
  });

  const addCondition = (type: StrategyCondition['type']) => {
    const newCondition: StrategyCondition = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      params: {}
    };
    
    setStrategy(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition]
    }));
  };

  const updateCondition = (id: string, params: Partial<StrategyCondition['params']>) => {
    setStrategy(prev => ({
      ...prev,
      conditions: prev.conditions.map(condition => 
        condition.id === id ? { ...condition, params: { ...condition.params, ...params } } : condition
      )
    }));
  };

  const removeCondition = (id: string) => {
    setStrategy(prev => ({
      ...prev,
      conditions: prev.conditions.filter(condition => condition.id !== id)
    }));
  };

  const handleSubmit = async () => {
    try {
    //   const response = await fetch('/api/strategy/execute', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(strategy),
    //   });
    //   const data = await response.json();
      // 处理结果
    } catch (error) {
      console.error('Strategy execution failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">策略名称</label>
        <input
          type="text"
          placeholder="输入策略名称"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          value={strategy.name}
          onChange={(e) => setStrategy(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div className="space-y-4">
        {strategy.conditions.map(condition => (
          <ConditionCard
            key={condition.id}
            condition={condition}
            onUpdate={(params) => updateCondition(condition.id, params)}
            onRemove={() => removeCondition(condition.id)}
          />
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-4">添加条件</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => addCondition('price')}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-colors"
          >
            + 价格条件
          </button>
          <button
            onClick={() => addCondition('volume')}
            className="px-4 py-2 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 transition-colors"
          >
            + 成交量条件
          </button>
          <button
            onClick={() => addCondition('drawdown')}
            className="px-4 py-2 bg-purple-500 text-white text-sm rounded-full hover:bg-purple-600 transition-colors"
          >
            + 回撤条件
          </button>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
      >
        执行策略
      </button>
    </div>
  );
} 