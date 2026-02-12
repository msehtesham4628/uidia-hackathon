import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AnalysisPanel from './components/AnalysisPanel';
import FilterBar from './components/FilterBar';
import { generateMockData, aggregateData, STATES, TYPES, DISTRICTS_BY_STATE } from './services/dataUtils';
import { analyzeDataset } from './services/gemini';
import { EnrolmentRecord, AggregatedStats, AIAnalysisResult, FilterState } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<EnrolmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    startDate: '',
    endDate: '',
    state: 'All',
    type: 'All',
    district: 'All'
  });
  
  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  // Initialize data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API delay for realism
    setTimeout(() => {
      const newData = generateMockData(3000);
      setData(newData);
      setAnalysisResult(null); // Reset analysis when data changes
      setIsLoading(false);
    }, 800);
  };

  // Filter Data
  const filteredData = useMemo(() => {
    return data.filter(record => {
      // Date Check
      if (filters.startDate && record.date < filters.startDate) return false;
      if (filters.endDate && record.date > filters.endDate) return false;
      
      // State Check
      if (filters.state !== 'All' && record.state !== filters.state) return false;
      
      // Type Check
      if (filters.type !== 'All' && record.type !== filters.type) return false;

      // District Check
      if (filters.district !== 'All' && record.district !== filters.district) return false;
      
      return true;
    });
  }, [data, filters]);

  // Derived Districts based on selected State
  const availableDistricts = useMemo(() => {
    if (filters.state === 'All') {
      // If no state selected, optionally show all districts or just a massive list
      // For performance and UX, usually we wait for state, but we can return all flattened
      return Object.values(DISTRICTS_BY_STATE).flat().sort();
    }
    return DISTRICTS_BY_STATE[filters.state]?.sort() || [];
  }, [filters.state]);

  // Memoize aggregated stats based on filtered data
  const stats: AggregatedStats = useMemo(() => {
    return aggregateData(filteredData);
  }, [filteredData]);

  const handleRunAnalysis = async () => {
    // We analyze the filtered dataset
    if (filteredData.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeDataset(stats);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      
      <FilterBar 
        filters={filters} 
        setFilters={setFilters} 
        availableStates={STATES} 
        availableDistricts={availableDistricts}
        availableTypes={TYPES} 
      />

      <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading component...</div>}>
        {activeTab === 'dashboard' && (
          <Dashboard 
            stats={stats} 
            onRefresh={refreshData} 
            isLoading={isLoading} 
          />
        )}

        {(activeTab === 'anomalies' || activeTab === 'insights') && (
          <AnalysisPanel 
            analysis={analysisResult} 
            isAnalyzing={isAnalyzing} 
            onRunAnalysis={handleRunAnalysis} 
          />
        )}
      </Suspense>
    </Layout>
  );
}
