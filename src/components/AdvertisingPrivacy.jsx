import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// This is an advertising status/opt-out interface, not a certified consent platform.
export default function AdvertisingPrivacy() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(() => window.stooplifyAdvertising?.hasSavedChoice() || false);
  const [message, setMessage] = useState('');
  const keepOff = () => {
    const saved = window.stooplifyAdvertising?.keepOff() === true;
    setDismissed(true);
    setMessage(saved ? 'Your choice to keep advertising off is saved on this browser for 180 days.' : 'Advertising remains off. This browser could not save your choice.');
  };
  return (
    <div className="fixed bottom-20 left-3 right-3 sm:right-auto sm:max-w-sm z-[1100] text-sm" data-testid="advertising-privacy">
      {!dismissed && (
        <section aria-label="Advertising privacy notice" className="mb-2 rounded-xl border border-slate-300 bg-white p-4 text-slate-900 shadow-lg dark:border-slate-600 dark:bg-slate-900 dark:text-white">
          <p className="font-semibold">Google advertising is off</p>
          <p className="mt-1">Ads and Google ad conversion tracking are paused while we finish our consent setup.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={keepOff} className="rounded-lg bg-slate-900 px-3 py-2 font-medium text-white dark:bg-white dark:text-slate-900">Keep advertising off</button>
            <button type="button" onClick={() => setOpen(true)} className="rounded-lg border border-slate-400 px-3 py-2 font-medium">Privacy details</button>
          </div>
        </section>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button type="button" className="rounded-full border border-slate-400 bg-white px-3 py-2 font-medium text-slate-900 shadow-md dark:bg-slate-900 dark:text-white">Advertising privacy</button>
        </DialogTrigger>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 bg-black/70" style={{ zIndex: 2147483000 }} />
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 grid gap-4 overflow-y-auto rounded-xl border border-slate-300 bg-white p-6 text-slate-900 shadow-xl dark:border-slate-600 dark:bg-slate-900 dark:text-white" style={{ zIndex: 2147483001, transform: "translate(-50%, -50%)", width: "min(32rem, calc(100vw - 2rem))", maxHeight: "85dvh" }}>
          <DialogHeader>
            <DialogTitle>Advertising privacy</DialogTitle>
            <DialogDescription>Google advertising is currently paused on Stooplify.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p>We do not load the Google AdSense or Google Ads conversion tags while this pause is in place. There is no option to turn them on yet.</p>
            <p>A certified consent platform still needs to be configured and tested before personalized ads can be offered where Google requires it, including the EEA, UK and Switzerland.</p>
            <p>You can save a preference to keep advertising off. It is stored only in this browser and expires after 180 days. This choice does not turn off account, payment, security or other analytics services described in our privacy policy.</p>
            <a className="block font-medium text-blue-700 underline dark:text-blue-300" href="/legal#privacy">Read the privacy policy</a>
            <button type="button" onClick={keepOff} className="w-full rounded-lg bg-slate-900 px-4 py-2 font-medium text-white dark:bg-white dark:text-slate-900">Keep advertising off</button>
            {message && <p role="status">{message}</p>}
          </div>
          <DialogPrimitive.Close className="rounded-lg border border-slate-400 px-4 py-2 font-medium">Close</DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </Dialog>
    </div>
  );
}
