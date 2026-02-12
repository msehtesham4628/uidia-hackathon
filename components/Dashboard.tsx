import React from 'react';
import { AggregatedStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, Line } from 'recharts';
import StatsCard from './StatsCard';
import IndiaMap from './IndiaMap';
import { Users, FileCheck, AlertTriangle, Activity, SearchX, Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardProps {
  stats: AggregatedStats;
  onRefresh: () => void;
  isLoading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onRefresh, isLoading }) => {
  
  // Handle empty state
  if (stats.totalRecords === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Operations Dashboard</h1>
            <p className="text-slate-500">Real-time monitoring of enrolment and update requests.</p>
          </div>
          <button 
            onClick={onRefresh}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Generate New Data'}
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 border-dashed min-h-[400px]">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <SearchX className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No records found</h3>
          <p className="text-slate-500 mt-2 text-center max-w-sm">
            No enrolment data matches your current filters. Try adjusting the date range, state, or enrolment type.
          </p>
        </div>
      </div>
    );
  }

  // Calculate derived stats
  const totalRejections = stats.byDate.reduce((acc, curr) => acc + curr.rejections, 0);
  const totalSuccess = Math.round((stats.totalRecords * stats.successRate) / 100);
  const totalPending = stats.totalRecords - totalSuccess - totalRejections;
  const rejectionRate = stats.totalRecords > 0 ? (totalRejections / stats.totalRecords) * 100 : 0;

  // Calculate Rejection Trend (Compare first half vs second half of the date range)
  const halfIndex = Math.floor(stats.byDate.length / 2);
  const firstHalf = stats.byDate.slice(0, halfIndex);
  const secondHalf = stats.byDate.slice(halfIndex);

  const firstHalfRejections = firstHalf.reduce((acc, curr) => acc + curr.rejections, 0);
  const secondHalfRejections = secondHalf.reduce((acc, curr) => acc + curr.rejections, 0);

  let rejectionTrend: 'up' | 'down' | 'neutral' = 'neutral';
  let rejectionDiffPerc = 0;

  if (firstHalfRejections > 0) {
    rejectionDiffPerc = ((secondHalfRejections - firstHalfRejections) / firstHalfRejections) * 100;
    if (rejectionDiffPerc > 2) rejectionTrend = 'up';
    else if (rejectionDiffPerc < -2) rejectionTrend = 'down';
  } else if (secondHalfRejections > 0) {
    rejectionTrend = 'up';
    rejectionDiffPerc = 100;
  }

  const rejectionTrendText = rejectionDiffPerc === 0 
    ? "No change" 
    : `${Math.abs(rejectionDiffPerc).toFixed(1)}% ${rejectionDiffPerc > 0 ? 'increase' : 'decrease'}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Operations Dashboard</h1>
          <p className="text-slate-500">Real-time monitoring of enrolment and update requests.</p>
        </div>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Generate New Data'}
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-6">
        <StatsCard 
          title="Total Processed" 
          value={stats.totalRecords.toLocaleString()} 
          subValue="Current Selection"
          icon={<Activity className="w-6 h-6" />}
        />
        <StatsCard 
          title="Success Rate" 
          value={`${stats.successRate.toFixed(1)}%`}
          trend={stats.successRate > 90 ? 'up' : 'down'}
          subValue="Target: 95%"
          icon={<FileCheck className="w-6 h-6" />}
        />
        <StatsCard 
          title="New Enrolments" 
          value={stats.totalNew.toLocaleString()}
          subValue={`${((stats.totalNew / stats.totalRecords) * 100).toFixed(0)}% of total`}
          icon={<Users className="w-6 h-6" />}
        />
        <StatsCard 
          title="Pending Reviews" 
          value={totalPending.toLocaleString()}
          subValue="Awaiting Action"
          icon={<Clock className="w-6 h-6 text-blue-600" />}
        />
        <StatsCard 
          title="Rejection Rate" 
          value={`${rejectionRate.toFixed(1)}%`}
          subValue="Requires Attention"
          tooltip={`Raw Rejections: ${totalRejections.toLocaleString()} out of ${stats.totalRecords.toLocaleString()} records`}
          icon={<AlertTriangle className="w-6 h-6 text-amber-600" />}
        />
        <StatsCard 
          title="Rejection Trend" 
          value={rejectionTrend === 'up' ? 'Rising' : rejectionTrend === 'down' ? 'Falling' : 'Stable'}
          trend={rejectionTrend}
          subValue={rejectionTrendText}
          icon={rejectionTrend === 'up' ? <TrendingUp className="w-6 h-6 text-red-500" /> : <TrendingDown className="w-6 h-6 text-green-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Daily Volume Trends</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.byDate}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                    dataKey="date" 
                    tickFormatter={(val) => val.split('-').slice(1).join('/')}
                    stroke="#64748B"
                    fontSize={12}
                />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" name="Total Requests" />
                <Line 
                  type="monotone" 
                  dataKey="rejections" 
                  stroke="#EF4444" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#EF4444', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#EF4444', strokeWidth: 0 }}
                  name="Rejections" 
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State Distribution Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Activity by State</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byState.slice(0, 10)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                <XAxis type="number" stroke="#64748B" fontSize={12} />
                <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    stroke="#64748B" 
                    fontSize={12}
                    tick={{fill: '#475569'}}
                />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* New Choropleth Map Section */}
      <div className="w-full">
        <IndiaMap data={stats.byState} />
      </div>
    </div>
  );
};

export default Dashboard;
