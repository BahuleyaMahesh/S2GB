// Maps helper service
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getSeverityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'critical': return '#EF4444';
    case 'high':     return '#F97316';
    case 'medium':   return '#EAB308';
    case 'low':      return '#22C55E';
    default:         return '#3b82f6';
  }
};

export const getIncidentIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'fire':    return '🔥';
    case 'medical': return '🚑';
    case 'accident':return '🚗';
    case 'police':  return '🚓';
    case 'hazmat':  return '⚠️';
    default:        return '📍';
  }
};
