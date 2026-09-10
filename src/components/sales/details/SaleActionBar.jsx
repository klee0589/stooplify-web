import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Navigation, MessageCircle, Heart, Share2, CalendarPlus, ChevronDown, Calendar } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function SaleActionBar({ isAttending, onToggleAttend, onDirections, showChat, onChat, isFavorite, onToggleFavorite, onShare, onAddToCalendar }) {
  const iconBtn = 'w-11 h-11 rounded-xl flex items-center justify-center border transition-all';
  return (
    <div className="flex flex-wrap gap-2">
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onToggleAttend}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-card transition-all ${
          isAttending ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>
        <UserCheck className="w-4 h-4" />
        {isAttending ? '✓ Attending' : "I'm Attending"}
      </motion.button>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onDirections}
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent-warm text-accent-warm-foreground rounded-xl font-semibold text-sm shadow-card hover:bg-accent-warm/90 transition-colors">
        <Navigation className="w-4 h-4" />
        Directions
      </motion.button>

      {showChat && (
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onChat}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-card border border-border text-foreground rounded-xl font-semibold text-sm shadow-card hover:border-primary hover:text-primary transition-colors">
          <MessageCircle className="w-4 h-4" />
          Chat
        </motion.button>
      )}

      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onToggleFavorite} aria-label="Favorite"
        className={`${iconBtn} ${isFavorite ? 'bg-accent-warm/10 border-accent-warm text-accent-warm' : 'bg-card border-border text-muted-foreground hover:border-accent-warm hover:text-accent-warm'}`}>
        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
      </motion.button>

      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onShare} aria-label="Share"
        className={`${iconBtn} bg-card border-border text-muted-foreground hover:border-primary hover:text-primary`}>
        <Share2 className="w-5 h-5" />
      </motion.button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} aria-label="Add to calendar"
            className="flex items-center justify-center gap-1 px-4 py-2.5 bg-card border border-border text-muted-foreground rounded-xl font-medium hover:border-primary hover:text-primary transition-all">
            <CalendarPlus className="w-4 h-4" />
            <ChevronDown className="w-3 h-3" />
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onAddToCalendar('google')} className="cursor-pointer gap-2">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none"><path d="M21.8 10.2H12v3.6h5.6c-.5 2.5-2.7 4.2-5.6 4.2-3.3 0-6-2.7-6-6s2.7-6 6-6c1.5 0 2.9.6 4 1.5l2.7-2.7C17.1 3.2 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.5 0 9.7-4 9.7-9.7 0-.7-.1-1.4-.2-2.1h-.7z" fill="#4285F4"/></svg>
            Google
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddToCalendar('ical')} className="cursor-pointer gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            Apple
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddToCalendar('outlook')} className="cursor-pointer gap-2">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="#0078D4"><path d="M7 2H3a1 1 0 00-1 1v18a1 1 0 001 1h18a1 1 0 001-1V8l-6-6H7zm11 17H6V11h12v8zM13 3.5L18.5 9H13V3.5z"/></svg>
            Outlook
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}