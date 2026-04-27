import React, { useState, useRef } from 'react';
import { processIncident, detectDuplicates } from '../services/geminiService';
import { addIncident, getIncidents } from '../services/firestoreService';
import { validateIncidentForm } from '../utils/validators';
import { AlertCircle, Send, Mic, Image as ImageIcon, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IncidentForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    description: '',
    incidentType: '',
    location: { address: '', latitude: null, longitude: null },
    userConsent: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateIncidentForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      // 1. Process with Gemini
      const structuredData = await processIncident(formData);
      
      // 2. Detect Duplicates
      const recent = await getIncidents({ limit: 50 });
      const dupes = await detectDuplicates({ ...structuredData, description: formData.description }, recent);
      
      // 3. Save to Firestore
      const incidentId = await addIncident({
        ...formData,
        structuredData,
        severity: structuredData.priority > 8 ? 'critical' : structuredData.priority > 6 ? 'high' : 'medium',
        duplicateScore: dupes[0]?.similarity || 0,
        duplicateOf: dupes[0]?.similarity > 70 ? dupes[0].incidentId : null
      });

      setStatus({ type: 'success', message: `Incident #${incidentId.slice(-5)} reported successfully.` });
      setFormData({ description: '', incidentType: '', location: { address: '', latitude: null, longitude: null }, userConsent: false });
      if (onSuccess) onSuccess(incidentId);
    } catch (error) {
      setStatus({ type: 'error', message: "Failed to process emergency report. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    // Simulated Voice-to-Text
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setFormData(prev => ({ ...prev, description: prev.description + " [Voice Input]: Fire in the kitchen on the 3rd floor. People are escaping." }));
    }, 2000);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-500/20 rounded-lg">
          <AlertCircle className="text-red-500" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-white">Report Emergency</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Describe the Situation</label>
          <div className="relative">
            <textarea
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
              rows={4}
              placeholder="What is happening? (e.g. 'Large fire at the chemical plant on Main St')"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button 
                type="button" 
                onClick={handleVoiceInput}
                className={`p-2 rounded-full transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                <Mic size={18} className="text-white" />
              </button>
              <button type="button" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
                <ImageIcon size={18} className="text-white" />
              </button>
            </div>
          </div>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
            <select
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.incidentType}
              onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
            >
              <option value="">Select Type</option>
              <option value="fire">Fire</option>
              <option value="medical">Medical</option>
              <option value="accident">Accident</option>
              <option value="hazmat">Hazmat</option>
              <option value="other">Other</option>
            </select>
            {errors.incidentType && <p className="text-red-500 text-xs mt-1">{errors.incidentType}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
            <input
              type="text"
              placeholder="Address or Landmarks"
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.location.address}
              onChange={(e) => setFormData({ 
                ...formData, 
                location: { address: e.target.value, latitude: 37.7749, longitude: -122.4194 } // Simulating coordinates
              })}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4 rounded border-white/20 bg-black/40 text-blue-500 focus:ring-blue-500"
            checked={formData.userConsent}
            onChange={(e) => setFormData({ ...formData, userConsent: e.target.checked })}
          />
          <p className="text-xs text-gray-400 leading-relaxed">
            I consent to sharing my location and report data with emergency services. 
            Data is stored securely and processed by AI to prioritize response.
          </p>
        </div>
        {errors.userConsent && <p className="text-red-500 text-xs">{errors.userConsent}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              AI Analyzing Report...
            </>
          ) : (
            <>
              <Send size={20} />
              Submit Emergency Report
            </>
          )}
        </button>
      </form>

      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
              status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="text-sm font-medium">{status.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IncidentForm;
