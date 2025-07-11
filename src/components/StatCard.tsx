import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  trend: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, trend, color }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <span className="text-sm font-medium text-green-600">{trend}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;