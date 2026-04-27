import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Clock, Users, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatTime, formatSeverity, formatIncidentType } from '../utils/formatters';
import { getSeverityColor } from '../services/mapsService';

const IncidentDetail = ({ incident, onClose, onResolve }) => {
  if (!incident) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass p-6 w-full max-w-lg shadow-3xl border-t-4"
      style={{ borderTopColor: getSeverityColor(incident.severity) }}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1 block">Incident Details</span>
          <h2 className="text-2xl font-black text-white leading-tight">
            {incident.structuredData?.title || formatIncidentType(incident.incidentType)}
          </h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all">
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <DetailItem icon={<Clock size={16} />} label="Reported" value={formatTime(incident.createdAt)} />
        <DetailItem icon={<MapPin size={16} />} label="Location" value={incident.location?.address || "Unknown"} />
        <DetailItem icon={<Users size={16} />} label="Est. Affected" value={incident.structuredData?.estimatedAffectedPeople || "Unknown"} />
        <DetailItem icon={<Shield size={16} />} label="Severity" value={formatSeverity(incident.severity)} color={getSeverityColor(incident.severity)} />
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Original Description</h4>
          <p className="text-sm text-gray-300 leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5">
            {incident.description}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Required Resources</h4>
          <div className="flex flex-wrap gap-2">
            {incident.structuredData?.requiredServices?.map((service, i) => (
              <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/20">
                {service}
              </span>
            ))}
          </div>
        </div>

        {incident.duplicateOf && (
          <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <AlertTriangle className="text-yellow-500" size={18} />
            <p className="text-xs text-yellow-500/80">
              This incident has been flagged as a duplicate of <span className="font-bold underline cursor-pointer">#{incident.duplicateOf.slice(-5)}</span>
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 flex gap-3">
        {incident.status !== 'resolved' ? (
          <button 
            onClick={() => onResolve(incident.id)}
            className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} /> Mark as Resolved
          </button>
        ) : (
          <div className="flex-1 bg-green-500/10 text-green-500 py-3 rounded-xl text-center font-bold border border-green-500/20">
            Resolved
          </div>
        )}
        <button onClick={onClose} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all">
          Close
        </button>
      </div>
    </motion.div>
  );
};

const DetailItem = ({ icon, label, value, color }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 bg-white/5 rounded-lg text-gray-400">
      {icon}
    </div>
    <div>
      <span className="text-[10px] text-gray-500 uppercase font-bold block">{label}</span>
      <span className="text-sm font-bold truncate block w-full" style={{ color: color || 'white' }}>{value}</span>
    </div>
  </div>
);

export default IncidentDetail;
