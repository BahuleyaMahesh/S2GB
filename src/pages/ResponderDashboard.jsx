import React, { useState, useRef } from 'react';
import { useIncidents } from '../hooks/useIncidents';
import IncidentMap from '../components/IncidentMap';
import IncidentList from '../components/IncidentList';
import IncidentDetail from '../components/IncidentDetail';
import LoadingSpinner from '../components/LoadingSpinner';
import { updateIncident } from '../services/firestoreService';
import { Shield, Activity, List, LayoutGrid, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useLocation } from 'react-router-dom';

const ResponderDashboard = () => {
  const { incidents, loading } = useIncidents();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [viewMode, setViewMode] = useState('split');
  const mapRef = useRef(null);
  const location = useLocation();

  const activeIncidents = incidents.filter(i => i.status !== 'resolved' && i.status !== 'merged');
  const criticalCount = activeIncidents.filter(i => i.severity === 'critical').length;
  const resolvedCount = incidents.filter(i => i.status === 'resolved').length;

  // Handle auto-focus from redirect
  React.useEffect(() => {
    if (!loading && activeIncidents.length > 0 && location.state?.selectedIncidentId) {
      const target = activeIncidents.find(inc => inc.id === location.state.selectedIncidentId);
      if (target) {
        // Delay to allow map tiles to render before flying to location
        setTimeout(() => {
          handleIncidentClick(target);
        }, 1000);
      }
    }
  }, [loading, location.state]); // Only run when loading finishes or state changes

  // Called when any incident is clicked (from list OR map marker)
  const handleIncidentClick = (incident) => {
    setSelectedIncident(incident);
    // Zoom the map in with affected-area circle
    if (mapRef.current) {
      mapRef.current.focusIncident(incident);
    }
  };

  const handleResolve = async (id) => {
    await updateIncident(id, { status: 'resolved' });
    setSelectedIncident(null);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <LoadingSpinner message="Loading India Crisis Network..." />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#05070a] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl px-6 py-3 flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg animate-pulse">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tighter">
              GEMINI <span className="text-blue-400">LIFELINE</span>
            </h1>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">India Crisis Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <StatBadge icon={<AlertCircle size={13} className="text-red-400" />} label="Critical" value={criticalCount} color="text-red-400" />
          <StatBadge icon={<Activity size={13} className="text-blue-400" />} label="Active" value={activeIncidents.length} color="text-blue-400" />
          <StatBadge icon={<CheckCircle size={13} className="text-green-400" />} label="Resolved" value={resolvedCount} color="text-green-400" />

          <div className="h-6 w-px bg-white/10" />

          <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 gap-0.5">
            <ViewBtn active={viewMode === 'map'} onClick={() => setViewMode('map')} icon={<LayoutGrid size={15} />} />
            <ViewBtn active={viewMode === 'split'} onClick={() => setViewMode('split')} icon={<Activity size={15} />} />
            <ViewBtn active={viewMode === 'list'} onClick={() => setViewMode('list')} icon={<List size={15} />} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex">
        {/* Map Panel */}
        <div className={`transition-all duration-500 h-full p-3 ${viewMode === 'list' ? 'w-0 p-0 overflow-hidden' :
          viewMode === 'map' ? 'w-full' : 'w-2/3'
          }`}>
          <IncidentMap
            ref={mapRef}
            incidents={activeIncidents}
            onIncidentClick={handleIncidentClick}
          />
        </div>

        {/* List Panel */}
        <div className={`transition-all duration-500 h-full border-l border-white/5 bg-black/10 flex flex-col ${viewMode === 'map' ? 'w-0 overflow-hidden' :
          viewMode === 'list' ? 'w-full' : 'w-1/3'
          }`}>
          <div className="p-4 border-b border-white/5 shrink-0">
            <h2 className="font-bold text-sm">Incident Feed</h2>
            <p className="text-[10px] text-gray-500 mt-0.5">Click any incident to zoom map & view details</p>
          </div>
          <div className="flex-1 overflow-hidden p-3">
            <IncidentList
              incidents={activeIncidents}
              onIncidentClick={handleIncidentClick}
            />
          </div>
        </div>
      </main>

      {/* Incident Detail Modal */}
      <AnimatePresence>
        {selectedIncident && (
          <div className="fixed inset-0 z-1100 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <IncidentDetail
              incident={selectedIncident}
              onClose={() => setSelectedIncident(null)}
              onResolve={handleResolve}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatBadge = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-2">
    {icon}
    <div>
      <div className="text-[8px] text-gray-500 uppercase font-black tracking-widest leading-none">{label}</div>
      <div className={`text-xl font-black leading-none ${color}`}>{value}</div>
    </div>
  </div>
);

const ViewBtn = ({ active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`p-1.5 rounded-md transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-500 hover:text-white'}`}
  >
    {icon}
  </button>
);

export default ResponderDashboard;
