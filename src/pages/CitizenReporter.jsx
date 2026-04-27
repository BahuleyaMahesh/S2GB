import React from 'react';
import IncidentForm from '../components/IncidentForm';
import { useIncidents } from '../hooks/useIncidents';
import { Shield, Activity, Map as MapIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const CitizenReporter = () => {
  const { incidents } = useIncidents();
  const recentIncidents = incidents.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg pulse">
              <Shield size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tighter">
              GEMINI <span className="text-blue-500">LIFELINE</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Network Active</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <div className="mb-8">
            <h2 className="text-4xl font-black mb-4 leading-tight">Your Report Helps Us <br/><span className="text-blue-500">Respond Faster.</span></h2>
            <p className="text-gray-400 max-w-md">
              Submit real-time information to our AI-powered crisis network. 
              We process every report in seconds to coordinate emergency teams.
            </p>
          </div>
          <IncidentForm />
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="glass p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Activity size={16} /> Recent Activity
              </h3>
              <span className="text-[10px] text-blue-500 font-bold cursor-pointer hover:underline">View Map</span>
            </div>
            
            <div className="space-y-4">
              {recentIncidents.map((inc) => (
                <div key={inc.id} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                    <span className="text-lg">
                      {inc.incidentType === 'fire' ? '🔥' : inc.incidentType === 'medical' ? '🚑' : '⚠️'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold mb-0.5">{inc.structuredData?.title || "Incident Reported"}</h4>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{inc.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-1 h-1 bg-gray-700 rounded-full" />
                      <span className="text-[9px] text-gray-600 font-bold uppercase">{inc.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/20">
             <div className="flex items-center gap-3 mb-4">
               <MapIcon className="text-blue-400" />
               <h3 className="font-bold">Crowdsourced Intelligence</h3>
             </div>
             <p className="text-xs text-blue-100/60 leading-relaxed mb-6">
               Gemini Lifeline merges multiple citizen reports to build a comprehensive view of ongoing crises. 
               By reporting, you are providing critical ground-truth data to responders.
             </p>
             <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all">
               Learn How It Works
             </button>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 text-gray-600 text-xs">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-sm">
            <p className="mb-4">© 2024 Gemini Lifeline. AI-Powered Crisis Intelligence Platform.</p>
            <p>For emergencies requiring immediate local assistance, always call your local emergency number (e.g. 911, 112) first.</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Responder Login</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CitizenReporter;
