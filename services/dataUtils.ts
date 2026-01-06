import { EnrolmentRecord, AggregatedStats } from '../types';

export const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
].sort();

export const DISTRICTS = ['District A', 'District B', 'District C', 'District D', 'District E', 'District F'];
export const TYPES = ['New Enrolment', 'Biometric Update', 'Demographic Update'] as const;
const STATUSES = ['Success', 'Success', 'Success', 'Success', 'Pending', 'Rejected'] as const; 
const GENDERS = ['M', 'F', 'O'] as const;
const AGES = ['0-5', '5-18', '18+', '18+', '18+'] as const;

export const generateMockData = (count: number = 2000): EnrolmentRecord[] => {
  const data: EnrolmentRecord[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const dateOffset = Math.floor(Math.random() * 30); 
    const date = new Date(today);
    date.setDate(date.getDate() - dateOffset);

    let status: 'Success' | 'Rejected' | 'Pending' = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const state = STATES[Math.floor(Math.random() * STATES.length)];
    
    // Maintain the artificial anomaly logic for AI detection
    if (state === 'Bihar' && dateOffset === 5) {
       if (Math.random() > 0.3) status = 'Rejected';
    }

    data.push({
      id: `EID-${Math.random().toString(36).substr(2, 9)}`,
      date: date.toISOString().split('T')[0],
      state: state,
      district: DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)],
      type: TYPES[Math.floor(Math.random() * TYPES.length)],
      status: status,
      gender: GENDERS[Math.floor(Math.random() * GENDERS.length)],
      ageGroup: AGES[Math.floor(Math.random() * AGES.length)],
      centerId: `CID-${100 + Math.floor(Math.random() * 20)}`
    });
  }
  
  return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const aggregateData = (data: EnrolmentRecord[]): AggregatedStats => {
  const byDateMap = new Map<string, { count: number; rejections: number }>();
  const byStateMap = new Map<string, number>();
  const byTypeMap = new Map<string, number>();
  
  let successCount = 0;
  let newCount = 0;
  let updateCount = 0;

  data.forEach(record => {
    if (record.status === 'Success') successCount++;
    if (record.type === 'New Enrolment') newCount++;
    else updateCount++;

    const dateStats = byDateMap.get(record.date) || { count: 0, rejections: 0 };
    dateStats.count++;
    if (record.status === 'Rejected') dateStats.rejections++;
    byDateMap.set(record.date, dateStats);

    byStateMap.set(record.state, (byStateMap.get(record.state) || 0) + 1);
    byTypeMap.set(record.type, (byTypeMap.get(record.type) || 0) + 1);
  });

  const byDate = Array.from(byDateMap.entries())
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const byState = Array.from(byStateMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const byType = Array.from(byTypeMap.entries())
    .map(([name, value]) => ({ name, value }));

  return {
    totalRecords: data.length,
    successRate: data.length > 0 ? (successCount / data.length) * 100 : 0,
    totalNew: newCount,
    totalUpdates: updateCount,
    byDate,
    byState,
    byType
  };
};