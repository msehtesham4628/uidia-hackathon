import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subValue, trend, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
        </div>
        {icon && <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">{icon}</div>}
      </div>
      {(subValue || trend) && (
        <div className="mt-4 flex items-center gap-2 text-sm">
            {trend === 'up' && <span className="text-green-600 font-medium">↑</span>}
            {trend === 'down' && <span className="text-red-600 font-medium">↓</span>}
            <span className="text-slate-600">{subValue}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
