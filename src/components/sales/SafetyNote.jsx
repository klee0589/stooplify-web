import React from 'react';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SafetyNote() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3"
    >
      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-blue-900">
        <p className="font-semibold mb-1">Safety Tip</p>
        <p className="text-blue-700">
          Always attend yard sales during daylight hours. Bring a friend when possible.
        </p>
      </div>
    </motion.div>
  );
}