import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, Package, Sofa, Shirt, Zap, Baby, Crown, BookOpen, Dumbbell, Users, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from '../translations';
import { DrawerSelect } from '@/components/ui/drawer-select';
import DiscoveryDropdowns from './DiscoveryDropdowns';

export default function SaleFilters({ filters, onFilterChange, onReset }) {
  const [language, setLanguage] = useState('en');
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (sheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sheetOpen]);

  const t = useTranslation(language);

  const categories = [
    { value: 'general', label: t('general'), icon: Package },
    { value: 'furniture', label: t('furniture'), icon: Sofa },
    { value: 'clothing', label: t('clothing'), icon: Shirt },
    { value: 'electronics', label: t('electronics'), icon: Zap },
    { value: 'toys', label: t('toysKids'), icon: Baby },
    { value: 'antiques', label: t('antiques'), icon: Crown },
    { value: 'books', label: t('booksMedia'), icon: BookOpen },
    { value: 'sports', label: t('sportsOutdoors'), icon: Dumbbell },
    { value: 'multi-family', label: t('multiFamily'), icon: Users },
  ];

  const distances = [
    { value: 'all', label: language === 'es' ? 'Cualquier distancia' : 'Any Distance' },
    { value: '5', label: language === 'es' ? 'Dentro de 5 millas' : 'Within 5 miles' },
    { value: '10', label: language === 'es' ? 'Dentro de 10 millas' : 'Within 10 miles' },
    { value: '25', label: language === 'es' ? 'Dentro de 25 millas' : 'Within 25 miles' },
    { value: '50', label: language === 'es' ? 'Dentro de 50 millas' : 'Within 50 miles' },
  ];

  const dateOptions = [
    { value: 'all', label: language === 'es' ? 'Cualquier fecha' : 'Any Date' },
    { value: 'today', label: language === 'es' ? 'Hoy' : 'Today' },
    { value: 'tomorrow', label: language === 'es' ? 'Mañana' : 'Tomorrow' },
    { value: 'weekend', label: language === 'es' ? 'Este fin de semana' : 'This Weekend' },
    { value: 'week', label: language === 'es' ? 'Esta semana' : 'This Week' },
  ];

  const paymentOptions = [
    { value: 'all', label: language === 'es' ? 'Cualquier pago' : 'Any Payment' },
    { value: 'cash', label: language === 'es' ? 'Efectivo' : 'Cash' },
    { value: 'card', label: language === 'es' ? 'Tarjetas' : 'Cards' },
    { value: 'digital', label: language === 'es' ? 'Digital' : 'Digital' },
  ];

  const handleCategoryToggle = (value) => {
    if (value === 'all') {
      onFilterChange({ ...filters, categories: [] });
      return;
    }
    const current = filters.categories || [];
    const isSelected = current.includes(value);
    const newCategories = isSelected ? current.filter(c => c !== value) : [...current, value];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const activeFilterCount = [
    (filters.categories?.length > 0) ? 1 : 0,
    (filters.date && filters.date !== 'all') ? 1 : 0,
    (filters.distance && filters.distance !== 'all') ? 1 : 0,
    (filters.payment && filters.payment !== 'all') ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <>
      {/* ── Desktop: full filter bar (hidden on mobile) ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden sm:block space-y-4 relative z-50"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="space-y-3">
            <Input
              placeholder={language === 'es' ? 'Buscar ventas...' : 'Search sales...'}
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61]"
            />
            <div className="grid grid-cols-4 gap-3">
              <DrawerSelect
                value={filters.categories?.length > 0 ? filters.categories[0] : 'all'}
                onValueChange={handleCategoryToggle}
                options={[{ value: 'all', label: language === 'es' ? 'Todas' : 'All Categories' }, ...categories.map(c => ({ value: c.value, label: c.label }))]}
                placeholder={filters.categories?.length > 0 ? `${filters.categories.length} ${language === 'es' ? 'seleccionadas' : 'selected'}` : (language === 'es' ? 'Categoría' : 'Category')}
                label={language === 'es' ? 'Seleccionar Categoría' : 'Select Category'}
                triggerClassName="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm"
                multiSelect={true}
                selectedValues={filters.categories || []}
              />
              <DrawerSelect
                value={filters.date || 'all'}
                onValueChange={(v) => onFilterChange({ ...filters, date: v })}
                options={dateOptions}
                placeholder={language === 'es' ? 'Fecha' : 'Date'}
                label={language === 'es' ? 'Seleccionar Fecha' : 'Select Date'}
                triggerClassName="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm"
              />
              <DrawerSelect
                value={filters.distance || 'all'}
                onValueChange={(v) => onFilterChange({ ...filters, distance: v })}
                options={distances}
                placeholder={language === 'es' ? 'Distancia' : 'Distance'}
                label={language === 'es' ? 'Seleccionar Distancia' : 'Select Distance'}
                triggerClassName="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm"
              />
              <DrawerSelect
                value={filters.payment || 'all'}
                onValueChange={(v) => onFilterChange({ ...filters, payment: v })}
                options={paymentOptions}
                placeholder={language === 'es' ? 'Pago' : 'Payment'}
                label={language === 'es' ? 'Seleccionar Pago' : 'Select Payment'}
                triggerClassName="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm"
              />
            </div>
          </div>
          {(filters.categories?.length > 0 || filters.date !== 'all' || filters.payment !== 'all' || filters.search) && (
            <Button variant="ghost" size="sm" onClick={onReset} className="text-gray-500 hover:text-[#FF6F61] mt-3">
              <X className="w-4 h-4 mr-1" />
              {language === 'es' ? 'Restablecer filtros' : 'Reset All Filters'}
            </Button>
          )}
        </div>
      </motion.div>

      {/* ── Mobile: search + filter button ── */}
      <div className="sm:hidden space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder={language === 'es' ? 'Buscar ventas...' : 'Search sales...'}
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="rounded-xl border-gray-200 flex-1"
          />
          <button
            onClick={() => setSheetOpen(true)}
            className="relative flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm whitespace-nowrap"
          >
            <Filter className="w-4 h-4" />
            {language === 'es' ? 'Filtros' : 'Filters'}
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FF6F61] text-white text-xs font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Bottom Sheet ── */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
              className="fixed inset-0 bg-black/40 z-[1100] sm:hidden"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[1200] bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl sm:hidden"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="font-semibold text-gray-900 dark:text-white text-base">
                  {language === 'es' ? 'Filtros' : 'Filters'}
                </span>
                <button onClick={() => setSheetOpen(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Filter sections */}
              <div className="px-5 py-4 space-y-5 overflow-y-auto max-h-[70vh]">

                {/* Date */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {language === 'es' ? 'Fecha' : 'Date'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dateOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => onFilterChange({ ...filters, date: opt.value })}
                        className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
                          (filters.date || 'all') === opt.value
                            ? 'bg-[#14B8FF] text-white border-[#14B8FF]'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Distance */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {language === 'es' ? 'Distancia' : 'Distance'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {distances.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => onFilterChange({ ...filters, distance: opt.value })}
                        className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
                          (filters.distance || 'all') === opt.value
                            ? 'bg-[#14B8FF] text-white border-[#14B8FF]'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {language === 'es' ? 'Categoría' : 'Category'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => {
                      const selected = (filters.categories || []).includes(cat.value);
                      return (
                        <button
                          key={cat.value}
                          onClick={() => handleCategoryToggle(cat.value)}
                          className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
                            selected
                              ? 'bg-[#14B8FF] text-white border-[#14B8FF]'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {language === 'es' ? 'Pago' : 'Payment'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {paymentOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => onFilterChange({ ...filters, payment: opt.value })}
                        className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
                          (filters.payment || 'all') === opt.value
                            ? 'bg-[#14B8FF] text-white border-[#14B8FF]'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 pt-3 pb-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                {activeFilterCount > 0 && (
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={() => { onReset(); }}>
                    {language === 'es' ? 'Restablecer' : 'Reset'}
                  </Button>
                )}
                <Button
                  className="flex-1 rounded-xl bg-[#14B8FF] hover:bg-[#0da3e6] text-white"
                  onClick={() => setSheetOpen(false)}
                >
                  {activeFilterCount > 0
                    ? (language === 'es' ? `Ver resultados (${activeFilterCount})` : `Show Results (${activeFilterCount})`)
                    : (language === 'es' ? 'Ver resultados' : 'Show Results')}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}