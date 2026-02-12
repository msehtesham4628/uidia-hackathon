import React from 'react';
import { AIAnalysisResult } from '../types';
import { AlertOctagon, TrendingUp, Lightbulb, CheckCircle2 } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: AIAnalysisResult | null;
  isAnalyzing: boolean;
  onRunAnalysis: () => void;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, isAnalyzing, onRunAnalysis }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Intelligence Hub</h1>
          <p className="text-slate-500">Anomaly detection and predictive modeling powered by Gemini.</p>
        </div>
        <button 
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running Deep Analysis...
            </>
          ) : (
            <>
              <Lightbulb className="w-4 h-4" />
              Run AI Analysis
            </>
          )}
        </button>
      </div>

      {!analysis && !isAnalyzing && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <div className="mx-auto w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No Analysis Generated</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">Click the button above to have Gemini scan the current dataset for irregularities and forecasts.</p>
        </div>
      )}

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Executive Summary */}
          <div className="lg:col-span-3 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-6 text-white shadow-md">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Executive Summary
            </h2>
            <p className="text-indigo-100 leading-relaxed">{analysis.summary}</p>
          </div>

          {/* Anomalies Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-500" />
              Detected Anomalies
            </h3>
            {analysis.anomalies.map((anomaly, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border-l-4 border-l-red-500 border-y border-r border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                    anomaly.severity === 'High' ? 'bg-red-100 text-red-700' : 
                    anomaly.severity === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {anomaly.severity} Severity
                  </span>
                  <span className="text-xs text-slate-400">{new Date(anomaly.detectedAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">{anomaly.title}</h4>
                <p className="text-sm text-slate-600 mb-2">{anomaly.description}</p>
                {anomaly.affectedDimension && (
                    <div className="text-xs font-mono bg-slate-100 p-1.5 rounded text-slate-600">
                        Target: {anomaly.affectedDimension}
                    </div>
                )}
              </div>
            ))}
            {analysis.anomalies.length === 0 && (
                <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
                    <p className="text-slate-500">No major anomalies detected.</p>
                </div>
            )}
          </div>

          {/* Predictions Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Predictive Indicators
            </h3>
            {analysis.predictions.map((pred, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-slate-500">{pred.timeframe}</span>
                  <span className={`flex items-center text-sm font-bold ${
                    pred.trend === 'Up' ? 'text-green-600' : pred.trend === 'Down' ? 'text-red-600' : 'text-slate-600'
                  }`}>
                    {pred.trend === 'Up' ? '↑ Increasing' : pred.trend === 'Down' ? '↓ Decreasing' : '→ Stable'}
                  </span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">
                    {pred.forecastValue.toLocaleString()} <span className="text-sm font-normal text-slate-400">est.</span>
                </div>
                <p className="text-sm text-slate-600 border-t border-slate-100 pt-3 mt-3">
                    {pred.rationale}
                </p>
                <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${pred.confidence * 100}%` }}></div>
                    </div>
                    <span className="text-xs text-slate-400">{(pred.confidence * 100).toFixed(0)}% Conf.</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Strategic Actions
            </h3>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <ul className="space-y-4">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-3">
                    <div className="mt-1 min-w-[20px] h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                    </div>
                    <p className="text-sm text-slate-700">{rec}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;

