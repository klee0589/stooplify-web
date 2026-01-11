import React from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'general', label: 'General' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'toys', label: 'Toys' },
  { value: 'antiques', label: 'Antiques' },
  { value: 'books', label: 'Books' },
  { value: 'sports', label: 'Sports' },
  { value: 'multi-family', label: 'Multi-Family' },
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

export default function SaleFilters({ filters, onFilterChange, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-2 text-[#2E3A59]">
          <Filter className="w-4 h-4" />
          <span className="font-medium text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Filters</span>
        </div>
        
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <Input
            placeholder="Search sales..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61]"
          />
          
          {/* Category */}
          <Select 
            value={filters.category || 'all'} 
            onValueChange={(value) => onFilterChange({ ...filters, category: value })}
          >
            <SelectTrigger className="rounded-xl border-gray-200">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
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
        </div>
        
        {/* Reset Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-gray-500 hover:text-[#FF6F61]"
        >
          <X className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>
    </motion.div>
  );
}