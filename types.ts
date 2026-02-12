export interface EnrolmentRecord {
  id: string;
  date: string;
  state: string;
  district: string;
  type: 'New Enrolment' | 'Biometric Update' | 'Demographic Update';
  status: 'Success' | 'Rejected' | 'Pending';
  gender: 'M' | 'F' | 'O';
  ageGroup: '0-5' | '5-18' | '18+';
  centerId: string;
}

export interface AggregatedStats {
  totalRecords: number;
  successRate: number;
  totalNew: number;
  totalUpdates: number;
  byDate: { date: string; count: number; rejections: number }[];
  byState: { name: string; count: number }[];
  byType: { name: string; value: number }[];
}

export interface Anomaly {
  id: string;
  severity: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  detectedAt: string;
  affectedDimension?: string; // e.g., "State: Bihar" or "Center: 1024"
}

export interface Prediction {
  timeframe: string;
  forecastValue: number;
  trend: 'Up' | 'Down' | 'Stable';
  confidence: number;
  rationale: string;
}

export interface AIAnalysisResult {
  summary: string;
  anomalies: Anomaly[];
  predictions: Prediction[];
  recommendations: string[];
}

export interface FilterState {
  startDate: string;
  endDate: string;
  state: string;
  type: string;
  district: string;
}
