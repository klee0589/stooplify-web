import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import { Loader2, MapPin } from 'lucide-react';

/**
 * Google Places Autocomplete input.
 * onSelect(result) => { address, city, state, zip_code, latitude, longitude, display_name }
 */
export default function AddressAutocomplete({ value, onChange, onSelect, placeholder = "Start typing an address...", className = "" }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const { isLoaded, error } = useGoogleMaps();
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'us' },
      fields: ['address_components', 'geometry', 'formatted_address', 'name'],
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      if (!place?.geometry) return;

      const components = place.address_components || [];
      const get = (type) => components.find(c => c.types.includes(type))?.long_name || '';
      const getShort = (type) => components.find(c => c.types.includes(type))?.short_name || '';

      const streetNumber = get('street_number');
      const route = get('route');
      const address = [streetNumber, route].filter(Boolean).join(' ');

      const result = {
        address,
        city: get('locality') || get('sublocality') || get('neighborhood'),
        state: getShort('administrative_area_level_1'),
        zip_code: get('postal_code'),
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        display_name: place.formatted_address,
      };

      if (onChange) onChange(result.address);
      if (onSelect) onSelect(result);
    });
  }, [isLoaded]);

  if (error) {
    // Fallback to plain input if Maps fails
    return (
      <input
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${className}`}
      />
    );
  }

  return (
    <div className="relative">
      {!isLoaded && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
          <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
        </div>
      )}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <MapPin className="w-4 h-4 text-gray-400" />
      </div>
      <input
        ref={inputRef}
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isLoaded ? placeholder : 'Loading address search...'}
        disabled={!isLoaded}
        className={`w-full rounded-xl border px-4 pl-10 py-3 text-gray-900 dark:bg-gray-700 dark:text-white transition-colors ${
          isFocused ? 'border-[#FF6F61] ring-1 ring-[#FF6F61]' : 'border-gray-200 dark:border-gray-600'
        } disabled:opacity-60 ${className}`}
        style={{ fontSize: '16px' }}
      />
    </div>
  );
}