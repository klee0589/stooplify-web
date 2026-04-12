import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Facebook, Twitter, Linkedin, MessageCircle, Link as LinkIcon, Instagram, Download, Image as ImageIcon } from 'lucide-react';
import { toast } from "sonner";
import html2canvas from 'html2canvas';

export default function ShareModal({ sale, isOpen, onClose }) {
  const flyerRef = useRef(null);
  const [isGeneratingFlyer, setIsGeneratingFlyer] = useState(false);

  if (!sale) return null;

  const shareUrl = window.location.href;
  const shareText = `Check out this yard sale: ${sale.title}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

  const generateFlyerImage = async () => {
    setIsGeneratingFlyer(true);
    const toastId = toast.loading('Generating flyer image...');
    try {
      const element = flyerRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
      });
      toast.dismiss(toastId);

      // Try native share with file if supported
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `${sale.title}-flyer.png`, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: sale.title,
              text: shareText,
              url: shareUrl,
              files: [file],
            });
            toast.success('Shared!');
          } catch (err) {
            if (err.name !== 'AbortError') {
              // Fallback: download
              const link = document.createElement('a');
              link.download = `${sale.title}-flyer.png`;
              link.href = canvas.toDataURL('image/png');
              link.click();
              toast.success('Flyer downloaded!');
            }
          }
        } else {
          // Fallback: download
          const link = document.createElement('a');
          link.download = `${sale.title}-flyer.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
          toast.success('Flyer downloaded!');
        }
      }, 'image/png');
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Failed to generate flyer');
    } finally {
      setIsGeneratingFlyer(false);
    }
  };

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

            {/* Share Flyer */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-3 text-center">Or share as a flyer image</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateFlyerImage}
                disabled={isGeneratingFlyer}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-white font-medium bg-[#FF6F61] hover:bg-[#e85d51] transition-all shadow-sm disabled:opacity-60"
              >
                {isGeneratingFlyer ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <ImageIcon className="w-5 h-5" />
                )}
                <span>{isGeneratingFlyer ? 'Generating...' : 'Share as Flyer Image'}</span>
              </motion.button>
            </div>

            {/* Hidden Flyer Template */}
            <div style={{ position: 'fixed', left: '-9999px', top: '-9999px' }}>
              <div
                ref={flyerRef}
                style={{ width: '600px', padding: '48px', backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }}
              >
                <div style={{ textAlign: 'center', marginBottom: '32px', borderBottom: '4px solid #FF6F61', paddingBottom: '24px' }}>
                  <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#2E3A59', margin: '0 0 8px 0', letterSpacing: '-1px' }}>YARD SALE</h1>
                  <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#FF6F61', margin: '0' }}>{sale.title}</h2>
                </div>

                <div style={{ display: 'flex', gap: '32px', marginBottom: '32px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>Date</p>
                      <p style={{ fontSize: '22px', fontWeight: '700', color: '#2E3A59', margin: '0' }}>
                        {sale.date ? new Date(sale.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                      </p>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>Time</p>
                      <p style={{ fontSize: '22px', fontWeight: '700', color: '#2E3A59', margin: '0' }}>{sale.start_time} – {sale.end_time}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>Location</p>
                      <p style={{ fontSize: '20px', fontWeight: '700', color: '#2E3A59', margin: '0 0 4px 0' }}>{sale.general_location}</p>
                      <p style={{ fontSize: '16px', color: '#6b7280', margin: '0' }}>{sale.city}, {sale.state}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={qrCodeUrl} alt="QR Code" style={{ width: '160px', height: '160px' }} crossOrigin="anonymous" />
                    <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginTop: '8px' }}>Scan for details</p>
                  </div>
                </div>

                {sale.description && (
                  <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                    <p style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px 0' }}>What's Available</p>
                    <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6', margin: '0' }}>{sale.description}</p>
                  </div>
                )}

                {sale.photos && sale.photos.length > 0 && (
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    {sale.photos.slice(0, 3).map((photo, i) => (
                      <img key={i} src={photo} alt="" crossOrigin="anonymous" style={{ width: '180px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                    ))}
                  </div>
                )}

                <div style={{ borderTop: '2px dashed #e5e7eb', paddingTop: '20px', textAlign: 'center' }}>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>
                    Posted on <span style={{ fontWeight: '700', color: '#FF6F61' }}>Stooplify</span>
                  </p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0' }}>Find more local yard sales at stooplify.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}