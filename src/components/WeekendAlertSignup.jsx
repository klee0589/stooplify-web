import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Bell, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const CITIES = ['Brooklyn', 'Queens', 'Manhattan', 'Bronx', 'Jersey City', 'Hoboken', 'San Francisco', 'Los Angeles', 'Other'];

export default function WeekendAlertSignup({ variant = 'banner', className = '' }) {
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    try {
      // Check if already subscribed
      const existing = await base44.entities.EmailSubscriber.filter({ email });
      if (existing.length === 0) {
        await base44.entities.EmailSubscriber.create({
          email,
          city: city || 'NYC',
          notify_new_sales: true,
        });
        // Send welcome email
        await base44.integrations.Core.SendEmail({
          to: email,
          subject: '🛍️ Weekend Alerts Activated — You\'re on the Stooplify list!',
          body: `<h2>You're in!</h2>
<p>Hey there,</p>
<p>You're now subscribed to weekend sale alerts from Stooplify${city ? ` for <strong>${city}</strong>` : ''}.</p>
<p>Every Friday we'll send you a roundup of the best upcoming stoop sales, yard sales, and garage sales near you so you can plan your weekend route.</p>
<p style="margin-top:20px;">
  <a href="https://stooplify.com/yard-sales" style="background:#14B8FF;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Browse This Weekend's Sales →</a>
</p>
<p style="margin-top:24px;font-size:13px;color:#888;">You can unsubscribe anytime by replying "unsubscribe" to any alert email.</p>
<p>Happy treasure hunting,<br/>The Stooplify Team</p>`
        });
      }
      base44.analytics.track({ eventName: 'weekend_alert_completed', properties: { city: city || 'unknown', source: variant } });
      setIsDone(true);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    }
    setIsLoading(false);
  };

  if (isDone) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 py-4 ${className}`}>
        <CheckCircle className="w-8 h-8 text-green-500" />
        <p className="font-semibold text-gray-800 dark:text-white">You're on the list! 🎉</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Check your inbox for a confirmation email.</p>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2 ${className}`} onClick={() => base44.analytics.track({ eventName: 'weekend_alert_started', properties: { source: variant } })}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#14B8FF]"
        />
        <select
          value={city}
          onChange={e => setCity(e.target.value)}
          className="px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#14B8FF]"
        >
          <option value="">📍 Any city</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-3 bg-[#14B8FF] text-white rounded-xl font-semibold text-sm hover:bg-[#0da3e6] transition-colors disabled:opacity-60 flex items-center gap-2 justify-center"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
          {isLoading ? 'Joining...' : 'Get Alerts'}
        </button>
      </form>
    );
  }

  // Banner variant (default)
  return (
    <div className={`bg-gradient-to-r from-[#14B8FF]/10 to-[#2E3A59]/10 dark:from-[#14B8FF]/20 dark:to-[#2E3A59]/20 border border-[#14B8FF]/20 rounded-2xl p-6 ${className}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-[#14B8FF] rounded-xl flex items-center justify-center flex-shrink-0">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Get Weekend Sale Alerts
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Every Friday: the best stoop sales and yard sales near you, straight to your inbox.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2" onClick={() => base44.analytics.track({ eventName: 'weekend_alert_started', properties: { source: variant } })}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#14B8FF]"
        />
        <select
          value={city}
          onChange={e => setCity(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#14B8FF]"
        >
          <option value="">📍 All cities</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-[#14B8FF] text-white rounded-xl font-semibold text-sm hover:bg-[#0da3e6] transition-colors disabled:opacity-60 flex items-center gap-2 justify-center whitespace-nowrap"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isLoading ? 'Joining...' : '🔔 Subscribe Free'}
        </button>
      </form>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">No spam. Unsubscribe anytime.</p>
    </div>
  );
}