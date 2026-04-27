import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Copy, Check, X } from 'lucide-react';

const DuplicateDetector = ({ potentialDuplicates, onMerge, onDismiss }) => {
  if (!potentialDuplicates || potentialDuplicates.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass max-w-md w-full p-6 border-t-4 border-yellow-500 shadow-yellow-900/20 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertCircle className="text-yellow-500" size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Potential Duplicate Detected</h2>
          </div>

          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            AI analysis has detected that this incident might be related to an existing report. 
            Merging will group these reports to prioritize the response.
          </p>

          <div className="space-y-3 mb-8">
            {potentialDuplicates.map((dup, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center group">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] bg-yellow-500 text-black font-black px-1.5 py-0.5 rounded">
                      {dup.similarity}% MATCH
                    </span>
                    <span className="text-xs font-bold text-gray-500">#{dup.incidentId.slice(-5)}</span>
                  </div>
                  <p className="text-xs text-gray-300 italic">"{dup.reason}"</p>
                </div>
                <button 
                  onClick={() => onMerge(dup.incidentId)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black p-2 rounded-lg transition-all"
                >
                  <Copy size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onDismiss}
              className="flex-1 py-3 text-sm font-bold text-gray-400 hover:text-white transition-all"
            >
              Keep Separate
            </button>
            <button 
              onClick={() => onMerge(potentialDuplicates[0].incidentId)}
              className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <Check size={18} /> Merge Selected
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DuplicateDetector;
