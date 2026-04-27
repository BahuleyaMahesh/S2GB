export const formatTime = (timestamp) => {
  if (!timestamp) return "Just now";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diff = Math.floor((new Date() - date) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
};

export const formatSeverity = (severity) => {
  return severity?.toUpperCase() || "UNKNOWN";
};

export const formatIncidentType = (type) => {
  return type ? type.charAt(0).toUpperCase() + type.slice(1) : "Other";
};
