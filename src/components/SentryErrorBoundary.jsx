import React from 'react';
import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

// Initialize Sentry
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: window.location.hostname === 'localhost' ? 'development' : 'production',
    sendDefaultPii: true,
    beforeSend(event, hint) {
      const error = hint.originalException;
      if (error && error.message) {
        if (error.message.includes('ResizeObserver')) return null;
      }
      return event;
    },
  });
}

// Fallback UI component
function FallbackComponent({ error, resetError }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-red-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">
            We've been notified and are working on it. Try refreshing the page.
          </p>
          <div className="space-y-3">
            <button
              onClick={resetError}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Go Home
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                Error Details
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                {error.toString()}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

// Error Boundary Wrapper
export default function SentryErrorBoundary({ children }) {
  if (!SENTRY_DSN) {
    return children;
  }

  return (
    <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
      {children}
    </Sentry.ErrorBoundary>
  );
}

// Utility functions to export
export function setUserContext(user) {
  if (!SENTRY_DSN) return;
  
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.full_name,
    });
  } else {
    Sentry.setUser(null);
  }
}

export function captureException(error, context) {
  if (!SENTRY_DSN) {
    console.error('Error:', error, context);
    return;
  }
  
  Sentry.captureException(error, {
    extra: context,
  });
}