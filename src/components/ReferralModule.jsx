import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Gift, Copy, Check, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function ReferralModule({ user }) {
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  // Referral code is a deterministic slug from user email
  const referralCode = btoa(user.email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 10).toLowerCase();
  const referralUrl = `https://stooplify.com/?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      base44.analytics.track({ eventName: 'referral_link_copied', properties: { user_email: user.email } });
      toast.success('Referral link copied!');
    });
  };

  const handleShare = () => {
    base44.analytics.track({ eventName: 'referral_link_shared', properties: { user_email: user.email } });
    if (navigator.share) {
      navigator.share({
        title: 'Find Stoop Sales Near You — Stooplify',
        text: 'I\'ve been using Stooplify to find amazing stoop sales and yard sales in NYC. Check it out!',
        url: referralUrl,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#FF6F61]/10 to-[#F5A623]/10 border border-[#FF6F61]/20 rounded-2xl p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-[#FF6F61] to-[#F5A623] rounded-xl flex items-center justify-center flex-shrink-0">
          <Gift className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Invite Friends, Grow the Community
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Share Stooplify with neighbors. The more sellers, the better finds for everyone.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-xl p-3 flex items-center gap-2 mb-3 border border-gray-200 dark:border-gray-600">
        <span className="flex-1 text-sm text-gray-600 dark:text-gray-300 truncate font-mono">
          {referralUrl}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <Button onClick={handleShare} className="w-full bg-[#FF6F61] hover:bg-[#e55a4d] text-white rounded-xl font-semibold">
        <Share2 className="w-4 h-4 mr-2" />
        Share Your Link
      </Button>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
        Your referral code: <span className="font-mono font-semibold">{referralCode}</span>
      </p>
    </div>
  );
}