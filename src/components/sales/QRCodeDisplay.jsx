import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, X, Download, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QRCodeDisplay({ saleId, saleTitle }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // The scan URL buyers will land on after scanning
  const scanUrl = `${window.location.origin}/YardSaleDetails?id=${saleId}&scan=1`;

  const handleDownload = () => {
    const svg = document.getElementById('seller-qr-code');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 400, 400);
      ctx.drawImage(img, 0, 0, 400, 400);
      const link = document.createElement('a');
      link.download = `stooplify-qr-${saleId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-[#2E3A59] to-[#1a2238] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <QrCode className="w-5 h-5 text-[#14B8FF]" />
          </div>
          <div>
            <h3 className="font-bold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Attendance QR Code
            </h3>
            <p className="text-white/60 text-xs">Let buyers scan to verify your sale</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="bg-white p-3 rounded-xl flex-shrink-0">
            <QRCodeSVG
              id="seller-qr-code"
              value={scanUrl}
              size={120}
              level="H"
              includeMargin={false}
            />
          </div>
          <div className="space-y-3 flex-1">
            <p className="text-white/80 text-sm leading-relaxed">
              Show this QR code at your sale. Buyers scan it to earn <span className="text-[#F5A623] font-semibold">Stooplify credits</span> and confirm attendance.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsExpanded(true)}
                size="sm"
                className="bg-[#14B8FF] hover:bg-[#0da3e6] text-white gap-1.5"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Enlarge
              </Button>
              <Button
                onClick={handleDownload}
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Save
              </Button>
            </div>
            <div className="flex gap-4 text-xs text-white/50">
              <span>🟢 Verified = 3+ scans</span>
              <span>🔵 Trusted = 10+ scans</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen QR modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="font-bold text-xl text-[#2E3A59] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {saleTitle}
              </h3>
              <p className="text-gray-500 text-sm mb-6">Scan to earn Stooplify credits</p>
              <div className="flex justify-center mb-6">
                <QRCodeSVG
                  value={scanUrl}
                  size={260}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="flex items-center justify-center gap-2 text-[#14B8FF]">
                <span className="text-2xl">💎</span>
                <span className="font-semibold text-[#2E3A59]">10 credits per verified scan</span>
              </div>
              <Button
                onClick={handleDownload}
                className="mt-4 w-full bg-[#2E3A59] hover:bg-[#1a2238] gap-2"
              >
                <Download className="w-4 h-4" />
                Download QR Code
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}