import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Printer } from 'lucide-react';
import { toast } from "sonner";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function PrintableFlyer({ sale }) {
  const flyerRef = useRef(null);

  const generatePDF = async () => {
    try {
      toast.loading('Generating flyer...');
      
      const element = flyerRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${sale.title}-flyer.pdf`);
      
      toast.dismiss();
      toast.success('Flyer downloaded!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate flyer');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const saleUrl = `${window.location.origin}/YardSaleDetails?id=${sale.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(saleUrl)}`;

  return (
    <div>
      <div className="flex gap-2 mb-4 print:hidden">
        <Button onClick={generatePDF} className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download Flyer
        </Button>
        <Button onClick={handlePrint} variant="outline" className="flex-1">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
      </div>

      {/* Printable Flyer */}
      <div 
        ref={flyerRef}
        className="bg-white p-8 rounded-lg shadow-lg print:shadow-none"
        style={{ width: '8.5in', minHeight: '11in' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-[#2E3A59] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            YARD SALE
          </h1>
          <h2 className="text-3xl font-bold text-[#FF6F61] mb-2">
            {sale.title}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Date</p>
              <p className="text-2xl font-bold text-[#2E3A59]">
                {new Date(sale.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Time</p>
              <p className="text-2xl font-bold text-[#2E3A59]">
                {sale.start_time} - {sale.end_time}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Location</p>
              <p className="text-xl font-bold text-[#2E3A59]">
                {sale.general_location}
              </p>
              <p className="text-lg text-gray-700">
                {sale.city}, {sale.state}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <img 
              src={qrCodeUrl} 
              alt="QR Code"
              className="w-48 h-48 mb-4"
            />
            <p className="text-center text-sm text-gray-600">
              Scan for details & exact address
            </p>
          </div>
        </div>

        {sale.description && (
          <div className="mb-8">
            <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">What's Available</p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {sale.description}
            </p>
          </div>
        )}

        {sale.photos && sale.photos.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {sale.photos.slice(0, 3).map((photo, index) => (
              <img 
                key={index}
                src={photo} 
                alt={`Item ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        <div className="border-t-2 border-dashed border-gray-300 pt-6 text-center">
          <p className="text-gray-600 mb-2">
            Posted on <span className="font-semibold text-[#FF6F61]">Stooplify</span>
          </p>
          <p className="text-sm text-gray-500">
            Find more local yard sales at stooplify.com
          </p>
        </div>
      </div>

      <style jsx>{`
        @media print {
          @page {
            size: letter;
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          .print\\:shadow-none,
          .print\\:shadow-none * {
            visibility: visible;
          }
          .print\\:shadow-none {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}