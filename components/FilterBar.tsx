import React from 'react';
import { Filter, X, Calendar, MapPin, CreditCard, ChevronDown, Search } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableStates: string[];
  availableDistricts: string[];
  availableTypes: readonly string[];
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, availableStates, availableDistricts, availableTypes }) => {
  const handleChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      // Reset district if state changes to avoid invalid district selection
      if (key === 'state') {
        newFilters.district = 'All';
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      state: 'All',
      type: 'All',
      district: 'All'
    });
  };

  const hasActiveFilters = filters.startDate || filters.endDate || filters.state !== 'All' || filters.type !== 'All' || filters.district !== 'All';

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold min-w-[100px]">
          <Filter className="w-5 h-5 text-blue-600" />
          <span>Filters</span>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
          {/* Date Range - Start */}
          <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
             </div>
             <input
              type="date"
              value={filters.startDate}
              max={filters.endDate} // Prevent start date from being after end date
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-600 placeholder-slate-400"
              placeholder="Start Date"
              aria-label="Start Date"
            />
          </div>

           {/* Date Range - End */}
           <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
             </div>
             <input
              type="date"
              value={filters.endDate}
              min={filters.startDate} // Prevent end date from being before start date
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-600 placeholder-slate-400"
              placeholder="End Date"
              aria-label="End Date"
            />
          </div>

          {/* State Selector */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
             </div>
            <select
              value={filters.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-600 appearance-none bg-white cursor-pointer hover:border-slate-400"
              aria-label="Filter by State"
            >
              <option value="All">All States</option>
              {availableStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* District Selector */}
          <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
             </div>
             <select
              value={filters.district}
              onChange={(e) => handleChange('district', e.target.value)}
              className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-600 appearance-none bg-white cursor-pointer hover:border-slate-400"
              aria-label="Filter by District"
            >
              <option value="All">All Districts</option>
              {availableDistricts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Type Selector */}
          <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
             </div>
            <select
              value={filters.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-600 appearance-none bg-white cursor-pointer hover:border-slate-400"
              aria-label="Filter by Enrolment Type"
            >
              <option value="All">All Types</option>
              {availableTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium whitespace-nowrap"
            aria-label="Clear all filters"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
