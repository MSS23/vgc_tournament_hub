import React, { useState } from 'react';
import { TrendingUp, PieChart, BarChart3, Filter } from 'lucide-react';
import { mockMetagameData } from '../data/mockData';
import UsageChart from './UsageChart';
import MetagameStats from './MetagameStats';

const MetagameAnalysis: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState('2024-regionals');
  const [analysisType, setAnalysisType] = useState<'pokemon' | 'items' | 'tera'>('pokemon');

  const formats = [
    { id: '2024-regionals', label: '2024 Regionals' },
    { id: '2024-worlds', label: '2024 Worlds' },
    { id: '2023-regionals', label: '2023 Regionals' },
    { id: 'all-time', label: 'All Time' },
  ];

  const analysisTypes = [
    { id: 'pokemon' as const, label: 'Pokémon Usage', icon: TrendingUp },
    { id: 'items' as const, label: 'Item Usage', icon: PieChart },
    { id: 'tera' as const, label: 'Tera Types', icon: BarChart3 },
  ];

  const currentData = mockMetagameData[selectedFormat] || mockMetagameData['2024-regionals'];

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Metagame Analysis</h2>
        <p className="text-purple-100">Discover trends and optimize your strategy</p>
      </div>

      {/* Format Selection */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Tournament Format</h3>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => setSelectedFormat(format.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedFormat === format.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {format.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Type Selection */}
      <div className="grid grid-cols-3 gap-2">
        {analysisTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setAnalysisType(type.id)}
              className={`p-4 rounded-xl text-center transition-all ${
                analysisType === type.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm font-medium">{type.label}</p>
            </button>
          );
        })}
      </div>

      {/* Stats Overview */}
      <MetagameStats data={currentData} />

      {/* Usage Chart */}
      <UsageChart
        data={currentData}
        type={analysisType}
        title={`${analysisTypes.find(t => t.id === analysisType)?.label} - ${formats.find(f => f.id === selectedFormat)?.label}`}
      />

      {/* Top Performers */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Top Performers</h3>
        <div className="space-y-3">
          {currentData[analysisType].slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-orange-500' :
                  'bg-blue-500'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.usage}% usage</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{item.winRate}%</p>
                <p className="text-xs text-gray-500">Win Rate</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetagameAnalysis;