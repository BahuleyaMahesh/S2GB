import React from 'react';
import { useIncidents } from '../hooks/useIncidents';
import IncidentList from './IncidentList';
import LoadingSpinner from './LoadingSpinner';

const ResponderDashboardComponent = ({ onIncidentClick }) => {
  const { incidents, loading } = useIncidents();
  
  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Active Incidents</h2>
        <span className="text-xs text-gray-500">{incidents.length} total</span>
      </div>
      <IncidentList incidents={incidents} onIncidentClick={onIncidentClick} />
    </div>
  );
};

export default ResponderDashboardComponent;
