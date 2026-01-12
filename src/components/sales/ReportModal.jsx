import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, MapPin, Shield, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const reportReasons = [
  { value: 'no_sale_at_location', label: 'No sale at this location', icon: MapPin },
  { value: 'feels_unsafe', label: 'Feels unsafe', icon: Shield },
  { value: 'suspicious_listing', label: 'Suspicious listing', icon: AlertTriangle },
  { value: 'spam', label: 'Spam or duplicate', icon: Flag },
];

export default function ReportModal({ sale, isOpen, onClose }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error('Please select a reason');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await base44.auth.me();
      
      await base44.entities.Report.create({
        yard_sale_id: sale.id,
        reporter_email: user.email,
        reason: selectedReason,
        details: details || undefined,
        status: 'pending'
      });

      // Check if we need to auto-hide (2+ reports)
      const reports = await base44.entities.Report.filter({ yard_sale_id: sale.id });
      if (reports.length >= 2) {
        await base44.entities.YardSale.update(sale.id, {
          status: 'pending',
          report_count: reports.length
        });
      } else {
        await base44.entities.YardSale.update(sale.id, {
          report_count: reports.length
        });
      }

      toast.success('Report submitted. Thank you for keeping the community safe!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2E3A59]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Report Listing
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Help us keep the community safe. Select a reason:
            </p>

            <div className="space-y-2 mb-4">
              {reportReasons.map((reason) => (
                <button
                  key={reason.value}
                  onClick={() => setSelectedReason(reason.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                    selectedReason === reason.value
                      ? 'border-[#FF6F61] bg-[#FF6F61]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <reason.icon className={`w-5 h-5 ${selectedReason === reason.value ? 'text-[#FF6F61]' : 'text-gray-400'}`} />
                  <span className={`font-medium ${selectedReason === reason.value ? 'text-[#2E3A59]' : 'text-gray-700'}`}>
                    {reason.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-[#2E3A59] mb-2 block">
                Additional details (optional)
              </label>
              <Textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Any other information..."
                className="rounded-xl"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-xl py-6"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedReason || isSubmitting}
                className="flex-1 rounded-xl py-6 bg-[#FF6F61] hover:bg-[#e55a4d]"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}