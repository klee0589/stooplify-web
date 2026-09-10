import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, MapPin } from 'lucide-react';

export default function SaleGallery({ photos = [], title }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const prev = () => setIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === photos.length - 1 ? 0 : i + 1));

  return (
    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="min-w-0 w-full">
      <div className="relative rounded-3xl overflow-hidden bg-card border border-border shadow-card">
        {photos.length > 0 ? (
          <>
            <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="aspect-[4/3] cursor-pointer" onClick={() => setOpen(true)}>
              <img src={photos[index]} alt={title} className="w-full h-full object-cover" />
            </motion.div>
            {photos.length > 1 && (
              <>
                <button onClick={prev} aria-label="Previous photo" className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-card hover:bg-card transition-colors">
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <button onClick={next} aria-label="Next photo" className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-card hover:bg-card transition-colors">
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {photos.map((_, i) => (
                    <button key={i} onClick={() => setIndex(i)} className={`h-2 rounded-full transition-all no-min-tap ${i === index ? 'bg-white w-6' : 'bg-white/50 w-2'}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent-warm/10 flex items-center justify-center">
            <MapPin className="w-16 h-16 text-primary/30" />
          </div>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {photos.map((photo, i) => (
            <motion.button key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIndex(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === index ? 'border-primary' : 'border-transparent'}`}>
              <img src={photo} alt="" className="w-full h-full object-cover" />
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && photos.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setOpen(false)}>
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"><X className="w-6 h-6" /></button>
            <motion.img key={index} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={photos[index]} alt="" className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
            {photos.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"><ChevronLeft className="w-6 h-6" /></button>
                <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"><ChevronRight className="w-6 h-6" /></button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}