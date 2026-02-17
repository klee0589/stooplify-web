import React from 'react';
import { motion } from 'framer-motion';
import { Filter, X, Check, Package, Sofa, Shirt, Zap, Baby, Crown, BookOpen, Dumbbell, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const categories = [
  { value: 'general', label: 'General', icon: Package },
  { value: 'furniture', label: 'Furniture', icon: Sofa },
  { value: 'clothing', label: 'Clothing', icon: Shirt },
  { value: 'electronics', label: 'Electronics', icon: Zap },
  { value: 'toys', label: 'Toys', icon: Baby },
  { value: 'antiques', label: 'Antiques', icon: Crown },
  { value: 'books', label: 'Books', icon: BookOpen },
  { value: 'sports', label: 'Sports', icon: Dumbbell },
  { value: 'multi-family', label: 'Multi-Family', icon: Users },
];

const distances = [
  { value: 'all', label: 'Any Distance' },
  { value: '5', label: 'Within 5 miles' },
  { value: '10', label: 'Within 10 miles' },
  { value: '25', label: 'Within 25 miles' },
  { value: '50', label: 'Within 50 miles' },
];

const dateOptions = [
  { value: 'all', label: 'Any Date' },
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'weekend', label: 'This Weekend' },
  { value: 'week', label: 'This Week' },
];

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'live', label: '🔴 Live Now' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'finished', label: 'Finished' },
];

const paymentOptions = [
  { value: 'all', label: 'Any Payment' },
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Cards' },
  { value: 'digital', label: 'Digital' },
];

export default function SaleFilters({ filters, onFilterChange, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Categories - Multi-select */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 text-[#2E3A59] dark:text-white mb-3">
          <Filter className="w-4 h-4" />
          <span className="font-medium text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Categories</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
          {categories.map((cat) => {
            const isSelected = filters.categories?.includes(cat.value);
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => {
                  const current = filters.categories || [];
                  const newCategories = isSelected
                    ? current.filter(c => c !== cat.value)
                    : [...current, cat.value];
                  onFilterChange({ ...filters, categories: newCategories });
                }}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#FF6F61] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{cat.label}</span>
                {isSelected && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Other Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <Input
            placeholder="Search sales..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61]"
          />
          
          {/* Status */}
          <Select 
            value={filters.status || 'all'} 
            onValueChange={(value) => onFilterChange({ ...filters, status: value })}
          >
            <SelectTrigger className="rounded-xl border-gray-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Date */}
          <Select 
            value={filters.date || 'all'} 
            onValueChange={(value) => onFilterChange({ ...filters, date: value })}
          >
            <SelectTrigger className="rounded-xl border-gray-200">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              {dateOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Distance */}
          <Select 
            value={filters.distance || 'all'} 
            onValueChange={(value) => onFilterChange({ ...filters, distance: value })}
          >
            <SelectTrigger className="rounded-xl border-gray-200">
              <SelectValue placeholder="Distance" />
            </SelectTrigger>
            <SelectContent>
              {distances.map((dist) => (
                <SelectItem key={dist.value} value={dist.value}>{dist.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Payment */}
          <Select 
            value={filters.payment || 'all'} 
            onValueChange={(value) => onFilterChange({ ...filters, payment: value })}
          >
            <SelectTrigger className="rounded-xl border-gray-200">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              {paymentOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Reset Button */}
        {(filters.categories?.length > 0 || filters.date !== 'all' || filters.status !== 'all' || filters.payment !== 'all' || filters.search) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-gray-500 hover:text-[#FF6F61] mt-3"
          >
            <X className="w-4 h-4 mr-1" />
            Reset All Filters
          </Button>
        )}
      </div>
    </motion.div>
  );
}