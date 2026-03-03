import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Facebook, Twitter, Linkedin, MessageCircle, Link as LinkIcon, Instagram, Download, Image as ImageIcon } from 'lucide-react';
import { toast } from "sonner";
import html2canvas from 'html2canvas';

export default function ShareModal({ sale, isOpen, onClose }) {
  if (!sale) return null;

  const shareUrl = window.location.href;
  const shareText = `Check out this yard sale: ${sale.title}`;

  const shareOptions = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2]',
      hoverColor: 'hover:bg-[#0e64d1]',
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'width=600,height=400'
        );
      }
    },
    {
      name: 'X',
      icon: Twitter,
      color: 'bg-[#000000]',
      hoverColor: 'hover:bg-[#333333]',
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'width=600,height=400'
        );
      }
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#515BD4]',
      hoverColor: 'hover:opacity-90',
      action: () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied! Open Instagram and paste in your story or post');
      }
    },
    {
      name: 'TikTok',
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      color: 'bg-[#000000]',
      hoverColor: 'hover:bg-[#333333]',
      action: () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied! Open TikTok and paste in your video description');
      }
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0A66C2]',
      hoverColor: 'hover:bg-[#004182]',
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'width=600,height=400'
        );
      }
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366]',
      hoverColor: 'hover:bg-[#1da851]',
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
          '_blank'
        );
      }
    },
    {
      name: 'Copy Link',
      icon: LinkIcon,
      color: 'bg-[#2E3A59]',
      hoverColor: 'hover:bg-[#1a2238]',
      action: () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
        onClose();
      }
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 
                className="text-xl font-bold text-[#2E3A59]"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Share This Sale
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-6 text-sm">
              Share "{sale.title}" with your friends and community
            </p>

            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option) => (
                <motion.button
                  key={option.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={option.action}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white font-medium ${option.color} ${option.hoverColor} transition-all shadow-sm`}
                >
                  {typeof option.icon === 'function' ? <option.icon /> : <option.icon className="w-5 h-5" />}
                  <span>{option.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}