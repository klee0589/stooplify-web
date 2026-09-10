import React, { useState } from 'react';
import { Heart, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const DISMISS_KEY = 'stooplify_signin_banner_dismissed';

export default function SignInPromptBanner({ user }) {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1');

  if (user || dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  };

  return (
    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Heart className="h-5 w-5 text-primary" />
      </div>
      <p className="flex-1 text-sm text-foreground">
        <span className="font-semibold">Sign in</span> to save favorites, mark sales you're attending, and get weekend alerts.
      </p>
      <button
        onClick={() => base44.auth.redirectToLogin()}
        className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Sign in
      </button>
      <button onClick={dismiss} aria-label="Dismiss" className="shrink-0 p-2 text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}