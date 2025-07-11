import React from 'react';
import { TrendingUp, Users, Trophy, Zap } from 'lucide-react';
import { MetagameData } from '../types';

interface MetagameStatsProps {
  data: MetagameData;
}

const MetagameStats: React.FC<MetagameStatsProps> = ({ data }) => {
  const stats = [
    {
      icon: Users,
      label: 'Total Players',
      value: data.totalPlayers.toLocaleString(),
      color: 'text-blue-600',
    },
    {
      icon: Trophy,
      label: 'Tournaments',
      value: data.tournaments.toString(),
      color: 'text-yellow-600',
    },
    {
      icon: TrendingUp,
      label: 'Unique Pokémon',
      value: data.uniquePokemon.toString(),
      color: 'text-green-600',
    },
    {
      icon: Zap,
      label: 'Meta Diversity',
      value: `${data.diversityIndex}%`,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetagameStats;