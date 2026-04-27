import React from 'react';
import { Mail, Instagram } from 'lucide-react';
import SEO from '../components/SEO';

export default function Contact() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4">
      <SEO
        title="Contact Stooplify | Get in Touch"
        description="Contact the Stooplify team with questions, feedback, or partnership inquiries. We'd love to hear from you."
        canonical="https://stooplify.com/contact"
      />
      <div className="max-w-2xl mx-auto">
        <h1
          className="text-4xl font-bold text-[#2E3A59] dark:text-white mb-4"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Contact Us
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg">
          Have a question, idea, or just want to say hi? We'd love to hear from you.
        </p>

        <div className="space-y-6">
          <a
            href="mailto:daniel@stooplify.com"
            className="flex items-center gap-4 p-5 bg-[#F9F9F9] dark:bg-gray-800 rounded-2xl hover:bg-[#FF6F61]/5 transition-colors border border-gray-100 dark:border-gray-700"
          >
            <div className="w-12 h-12 bg-[#FF6F61]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-[#FF6F61]" />
            </div>
            <div>
              <p className="font-semibold text-[#2E3A59] dark:text-white">Email Us</p>
              <p className="text-[#FF6F61] text-sm">daniel@stooplify.com</p>
            </div>
          </a>

          <a
            href="https://www.instagram.com/stooplify/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-[#F9F9F9] dark:bg-gray-800 rounded-2xl hover:bg-[#14B8FF]/5 transition-colors border border-gray-100 dark:border-gray-700"
          >
            <div className="w-12 h-12 bg-[#14B8FF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Instagram className="w-6 h-6 text-[#14B8FF]" />
            </div>
            <div>
              <p className="font-semibold text-[#2E3A59] dark:text-white">Instagram</p>
              <p className="text-[#14B8FF] text-sm">@stooplify</p>
            </div>
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=61586102653727"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-[#F9F9F9] dark:bg-gray-800 rounded-2xl hover:bg-blue-50 transition-colors border border-gray-100 dark:border-gray-700"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-[#2E3A59] dark:text-white">Facebook</p>
              <p className="text-blue-600 text-sm">Stooplify on Facebook</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}