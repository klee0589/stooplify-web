import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Lock, Clock, CheckCircle } from 'lucide-react';
import { differenceInHours } from 'date-fns';

export default function AddressDisplay({ sale, isAttending, showIcon = true }) {
  const isAddressUnlocked = () => {
    if (!sale.date || !sale.start_time) return false;
    
    // Combine date and time to get the actual start datetime
    const saleDateTime = new Date(`${sale.date}T${sale.start_time}`);
    const now = new Date();
    const hoursUntilSale = differenceInHours(saleDateTime, now);
    
    // Unlock if within unlock window or user is attending
    return hoursUntilSale <= (sale.address_unlock_hours || 24) || isAttending;
  };

  const unlocked = isAddressUnlocked();

  if (unlocked) {
    // Show exact address
    return (
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className="w-10 h-10 bg-[#2E3A59]/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-[#2E3A59]" />
          </div>
        )}
        <div className="flex-1">
          {showIcon && <p className="text-xs text-gray-500 mb-1">Location</p>}
          <p className="font-semibold text-[#2E3A59]">{sale.address}</p>
          <p className="text-gray-600">{sale.city}, {sale.state} {sale.zip_code}</p>
          {isAttending && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 mt-2 text-xs text-green-600"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>You're attending - exact address revealed</span>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Show general location with lock indicator
  const getHoursUntilUnlock = () => {
    if (!sale.date || !sale.start_time) return null;
    const saleDateTime = new Date(`${sale.date}T${sale.start_time}`);
    const unlockTime = new Date(saleDateTime.getTime() - (sale.address_unlock_hours || 24) * 60 * 60 * 1000);
    const now = new Date();
    const hoursUntil = Math.max(0, differenceInHours(unlockTime, now));
    return hoursUntil;
  };

  const hoursUntilUnlock = getHoursUntilUnlock();

  return (
    <div className="flex items-start gap-3">
      {showIcon && (
        <div className="w-10 h-10 bg-[#F5A623]/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Lock className="w-5 h-5 text-[#F5A623]" />
        </div>
      )}
      <div className="flex-1">
        {showIcon && <p className="text-xs text-gray-500 mb-1">General Location</p>}
        <p className="font-semibold text-[#2E3A59]">{sale.general_location || 'Location hidden'}</p>
        <p className="text-gray-600">{sale.city}, {sale.state}</p>
        {hoursUntilUnlock !== null && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-[#F5A623]/10 rounded-lg text-xs text-[#F5A623] w-fit"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>
              {hoursUntilUnlock === 0 
                ? 'Unlocking soon!' 
                : `Exact address in ${hoursUntilUnlock}h`}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}