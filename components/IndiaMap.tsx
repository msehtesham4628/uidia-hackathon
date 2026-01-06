import React, { useState, useMemo, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';

// Reliable TopoJSON source for India states (Deldersveld)
const INDIA_MAP_URL = 'https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json';

const STATE_ABBREVIATIONS: Record<string, string> = {
  "andhra pradesh": "AP",
  "arunachal pradesh": "AR",
  "assam": "AS",
  "bihar": "BR",
  "chhattisgarh": "CT",
  "goa": "GA",
  "gujarat": "GJ",
  "haryana": "HR",
  "himachal pradesh": "HP",
  "jharkhand": "JH",
  "karnataka": "KA",
  "kerala": "KL",
  "madhya pradesh": "MP",
  "maharashtra": "MH",
  "manipur": "MN",
  "meghalaya": "ML",
  "mizoram": "MZ",
  "nagaland": "NL",
  "odisha": "OD",
  "orissa": "OD",
  "punjab": "PB",
  "rajasthan": "RJ",
  "sikkim": "SK",
  "tamil nadu": "TN",
  "telangana": "TG",
  "tripura": "TR",
  "uttar pradesh": "UP",
  "uttarakhand": "UK",
  "uttaranchal": "UK",
  "west bengal": "WB",
  "andaman and nicobar islands": "AN",
  "chandigarh": "CH",
  "dadra and nagar haveli and daman and diu": "DN",
  "delhi": "DL",
  "jammu and kashmir": "JK",
  "ladakh": "LA",
  "lakshadweep": "LD",
  "puducherry": "PY"
};

interface IndiaMapProps {
  data: { name: string; count: number }[];
}

const IndiaMap: React.FC<IndiaMapProps> = ({ data }) => {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch TopoJSON manually to avoid internal library suspension (React 19) and handle errors
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(INDIA_MAP_URL)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch map data (${res.status})`);
        }
        return res.json();
      })
      .then(json => {
        if (isMounted) {
          setGeoData(json);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Map Load Error:", err);
        if (isMounted) {
          setError(err.message || 'Failed to load geographic data');
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, []);

  const colorScale = useMemo(() => {
    const domainValues = data.length > 0 ? data.map(d => d.count) : [0, 1];
    
    return scaleQuantile<string>()
      .domain(domainValues)
      .range([
        '#EFF6FF', // blue-50
        '#DBEAFE', // blue-100
        '#BFDBFE', // blue-200
        '#93C5FD', // blue-300
        '#60A5FA', // blue-400
        '#3B82F6', // blue-500
        '#2563EB', // blue-600
        '#1D4ED8', // blue-700
      ]);
  }, [data]);

  const statsMap = useMemo(() => {
    return data.reduce((acc, curr) => {
      // Normalize state name for better matching
      // Map some common variations if necessary
      let stateName = curr.name.toLowerCase();
      // Simple mapping for potential mismatches (example)
      if (stateName === 'odisha') stateName = 'orissa'; 
      if (stateName === 'uttarakhand') stateName = 'uttaranchal';
      
      acc[stateName] = curr.count;
      return acc;
    }, {} as Record<string, number>);
  }, [data]);

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h3 className="text-slate-900 font-semibold">Map Unavailable</h3>
        <p className="text-slate-500 text-sm mt-1">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative map-container bg-white p-6 rounded-xl border border-slate-200 shadow-sm w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Geographic Heatmap</h3>
        <div className="flex items-center gap-2">
           <span className="text-xs text-slate-500">Volume</span>
           <div className="flex gap-0.5">
             {[...Array(5)].map((_, i) => (
               <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: colorScale.range()[Math.floor(i * (colorScale.range().length / 5))] }} />
             ))}
           </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-[450px] flex items-center justify-center relative bg-slate-50/30 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-slate-400">
             <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
             <span className="text-sm font-semibold tracking-wide">Initializing Geographic Data...</span>
          </div>
        ) : (
          <ComposableMap
            projectionConfig={{ scale: 1000, center: [82, 22] }}
            width={800}
            height={650}
            style={{ width: "100%", height: "auto" }}
          >
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  // Properties vary by source. Deldersveld usually uses NAME_1.
                  const rawName = geo.properties.NAME_1 || geo.properties.ST_NM || geo.properties.state_name || "";
                  const stateName = rawName.toLowerCase();
                  
                  // Check mapped names (e.g. orissa -> odisha map check)
                  let count = statsMap[stateName] || 0;
                  
                  // Inverse check if map has 'orissa' but data has 'odisha' (which is normalized to odisha in statsMap)
                  // The statsMap keys are already normalized to what we expect from data (e.g. odisha).
                  // If map says 'orissa', we check statsMap['orissa']. If statsMap['orissa'] exists (added in statsMap calc), we use it.

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        const abbr = STATE_ABBREVIATIONS[stateName];
                        const abbrSuffix = abbr ? ` (${abbr})` : '';
                        setTooltip(`${rawName}${abbrSuffix}: ${count.toLocaleString()} records`);
                      }}
                      onMouseLeave={() => {
                        setTooltip(null);
                      }}
                      style={{
                        default: {
                          fill: count ? colorScale(count) : '#F1F5F9',
                          stroke: '#E2E8F0',
                          strokeWidth: 0.7,
                          outline: 'none'
                        },
                        hover: {
                          fill: '#2563EB',
                          stroke: '#1D4ED8',
                          strokeWidth: 1.5,
                          outline: 'none',
                          cursor: 'pointer'
                        },
                        pressed: {
                          fill: '#1E3A8A',
                          outline: 'none'
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        )}

        {tooltip && (
          <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm text-white text-xs py-2 px-4 rounded-lg shadow-2xl pointer-events-none z-10 font-bold animate-in fade-in zoom-in duration-200">
            {tooltip}
          </div>
        )}
      </div>
      <p className="mt-4 text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
        State-Level Enrollment Intensity
      </p>
    </div>
  );
};

export default IndiaMap;