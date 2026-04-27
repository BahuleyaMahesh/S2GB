import React, { useState } from 'react';
import { formatTime, formatSeverity, formatIncidentType } from '../utils/formatters';
import { getSeverityColor } from '../services/mapsService';
import { Search, Filter, ChevronRight, Clock, MapPin } from 'lucide-react';

const IncidentList = ({ incidents, onIncidentClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = incidents.filter(inc => {
    const matchesSearch = inc.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inc.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || inc.incidentType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text"
            placeholder="Search incidents..."
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="fire">Fire</option>
          <option value="medical">Medical</option>
          <option value="accident">Accident</option>
          <option value="hazmat">Hazmat</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {filtered.map(incident => (
          <div 
            key={incident.id}
            onClick={() => onIncidentClick(incident)}
            className="glass p-4 hover:border-white/20 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-2">
              <span 
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md"
                style={{ backgroundColor: `${getSeverityColor(incident.severity)}20`, color: getSeverityColor(incident.severity) }}
              >
                {formatSeverity(incident.severity)}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <Clock size={12} />
                {formatTime(incident.createdAt)}
              </div>
            </div>

            <h3 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
              {incident.structuredData?.title || formatIncidentType(incident.incidentType)}
            </h3>
            
            <div className="flex items-center gap-2 text-[10px] text-gray-400">
              <MapPin size={12} />
              <span className="truncate">{incident.location?.address || "Unknown Location"}</span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-1">
                {incident.structuredData?.requiredServices?.slice(0, 2).map((service, i) => (
                  <span key={i} className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-gray-500">
                    {service}
                  </span>
                ))}
              </div>
              <ChevronRight size={14} className="text-gray-600 group-hover:text-white transition-colors" />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            No incidents found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentList;
