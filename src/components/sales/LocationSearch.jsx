import React, { useState } from 'react';
import { Search, X, Loader2, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';

// Search any US city, state or ZIP and recenter the map there.
export default function LocationSearch({ location, onSelect, language = 'en' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const es = language === 'es';

  const runSearch = async (e) => {
    e?.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await base44.functions.invoke('geocodeCity', { q });
      const list = res?.data?.results || [];
      if (list.length === 0) {
        setError(es ? 'No encontramos esa ciudad. Prueba con "Ciudad, Estado".' : 'No match. Try "City, State" or a ZIP code.');
      } else if (list.length === 1) {
        onSelect(list[0]);
        setQuery('');
      } else {
        setResults(list);
      }
    } catch (err) {
      setError(es ? 'No se pudo buscar. Inténtalo de nuevo.' : 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pick = (result) => {
    onSelect(result);
    setResults([]);
    setQuery('');
  };

  return (
    <div className="space-y-2">
      <form onSubmit={runSearch} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={es ? 'Ciudad, estado o código ZIP' : 'City, state or ZIP code'}
            className="rounded-xl border-gray-200 pl-9 focus:border-[#FF6F61] focus:ring-[#FF6F61]"
            aria-label={es ? 'Buscar por ciudad' : 'Search by city'}
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="no-min-tap flex items-center gap-1.5 px-4 rounded-xl bg-[#FF6F61] text-white text-sm font-semibold shadow-sm hover:bg-[#e55a4d] transition-colors disabled:opacity-60"
        >
          <Search className="w-4 h-4" />
          {es ? 'Buscar' : 'Search'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
          {results.map((r) => (
            <button
              key={`${r.lat}-${r.lng}-${r.label}`}
              type="button"
              onClick={() => pick(r)}
              className="no-min-tap w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              {r.label}
              {r.zip ? <span className="text-gray-400"> · {r.zip}</span> : null}
            </button>
          ))}
        </div>
      )}

      {location && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#14B8FF]/10 px-3 py-1 text-sm font-medium text-[#0b7ea8]">
            <MapPin className="w-3.5 h-3.5" />
            {location.label}
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="no-min-tap ml-0.5 hover:text-[#0b7ea8]/70"
              aria-label={es ? 'Borrar ubicación' : 'Clear location'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}