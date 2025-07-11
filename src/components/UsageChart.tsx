import React from 'react';
import { MetagameData } from '../types';

interface UsageChartProps {
  data: MetagameData;
  type: 'pokemon' | 'items' | 'tera';
  title: string;
}

const UsageChart: React.FC<UsageChartProps> = ({ data, type, title }) => {
  const chartData = data[type].slice(0, 10);
  const maxUsage = Math.max(...chartData.map(item => item.usage));

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-16 text-sm font-medium text-gray-700 truncate">
              {item.name}
            </div>
            <div className="flex-1 flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.usage / maxUsage) * 100}%` }}
                />
              </div>
              <div className="w-12 text-sm font-medium text-gray-900 text-right">
                {item.usage}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsageChart;