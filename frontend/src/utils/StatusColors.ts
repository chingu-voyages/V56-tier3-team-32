export const statusColors: Record<string, string> = {
  'Checked In': '#B3E5FC',
  'Pre-Procedure': '#03A9F4',
  'In-Progress': '#FB8C00',
  Closing: '#FDD835', // no quote needed for single word keys
  Recovery: '#4DB6AC',
  Complete: '#66BB6A',
  Dismissal: '#9E9E9E',
};

export const getStatusColor = (statusCode: string): string => {
  return statusColors[statusCode] || '#9E9E9E';
};

export const getStatusTextColor = (statusCode: string): string => {
  return '#212121';
};
