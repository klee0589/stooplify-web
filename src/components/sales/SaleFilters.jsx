import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, Check, Package, Sofa, Shirt, Zap, Baby, Crown, BookOpen, Dumbbell, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from '../translations';
import { DrawerSelect } from '@/components/ui/drawer-select';

export default function SaleFilters({ filters, onFilterChange, onReset }) {
  const [language, setLanguage] = useState('en');
  
  useEffect(() => {
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);
    
    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

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
    const current = filters.categories || [];
    const isSelected = current.includes(value);
    const newCategories = isSelected
      ? current.filter(c => c !== value)
      : [...current, value];
    onFilterChange({ ...filters, categories: newCategories });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* All Filters in One Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="space-y-3">
          {/* Search - Full Width */}
          <Input
            placeholder={language === 'es' ? 'Buscar ventas...' : 'Search sales...'}
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61]"
          />
          
          {/* Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Categories - Multi-select Drawer */}
            <DrawerSelect
              value={filters.categories?.length > 0 ? filters.categories[0] : 'all'}
              onValueChange={handleCategoryToggle}
              options={[
                { value: 'all', label: language === 'es' ? 'Todas' : 'All Categories' },
                ...categories.map(cat => ({ value: cat.value, label: cat.label }))
              ]}
              placeholder={
                filters.categories?.length > 0 
                  ? `${filters.categories.length} ${language === 'es' ? 'seleccionadas' : 'selected'}`
                  : (language === 'es' ? 'Categoría' : 'Category')
              }
              label={language === 'es' ? 'Seleccionar Categoría' : 'Select Category'}
              triggerClassName="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              multiSelect={true}
              selectedValues={filters.categories || []}
            />
            
            {/* Date */}
            <DrawerSelect
              value={filters.date || 'all'}
              onValueChange={(value) => onFilterChange({ ...filters, date: value })}
              options={dateOptions}
              placeholder={language === 'es' ? 'Fecha' : 'Date'}
              label={language === 'es' ? 'Seleccionar Fecha' : 'Select Date'}
              triggerClassName="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            
            {/* Distance */}
            <DrawerSelect
              value={filters.distance || 'all'}
              onValueChange={(value) => onFilterChange({ ...filters, distance: value })}
              options={distances}
              placeholder={language === 'es' ? 'Distancia' : 'Distance'}
              label={language === 'es' ? 'Seleccionar Distancia' : 'Select Distance'}
              triggerClassName="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            
            {/* Payment */}
            <DrawerSelect
              value={filters.payment || 'all'}
              onValueChange={(value) => onFilterChange({ ...filters, payment: value })}
              options={paymentOptions}
              placeholder={language === 'es' ? 'Pago' : 'Payment'}
              label={language === 'es' ? 'Seleccionar Pago' : 'Select Payment'}
              triggerClassName="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
        
        {/* Reset Button */}
        {(filters.categories?.length > 0 || filters.date !== 'all' || filters.payment !== 'all' || filters.search) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-gray-500 hover:text-[#FF6F61] mt-3"
          >
            <X className="w-4 h-4 mr-1" />
            {language === 'es' ? 'Restablecer filtros' : 'Reset All Filters'}
          </Button>
        )}
      </div>
    </motion.div>
  );
}