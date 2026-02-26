import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Calendar as CalendarIcon, MapPin, Clock, Heart, Users, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import YardSaleCard from '@/components/YardSaleCard';
import { isSameDay, format } from 'date-fns';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [eventFilter, setEventFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: allSales = [] } = useQuery({
    queryKey: ['yardSales', 'approved'],
    queryFn: () => base44.entities.YardSale.filter({ status: 'approved' }),
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', user?.email],
    queryFn: () => user ? base44.entities.Favorite.filter({ user_email: user.email }) : [],
    enabled: !!user,
  });

  const { data: attendances = [] } = useQuery({
    queryKey: ['attendances', user?.email],
    queryFn: () => user ? base44.entities.Attendance.filter({ user_email: user.email }) : [],
    enabled: !!user,
  });

  const isFavorited = (saleId) => favorites.some(fav => fav.yard_sale_id === saleId);
  const isAttending = (saleId) => attendances.some(att => att.yard_sale_id === saleId);

  // Get dates with events (respecting filter)
  const datesWithEvents = allSales
    .filter(sale => {
      if (!sale.date) return false;
      // Apply event filter
      if (eventFilter === 'favorites') return isFavorited(sale.id);
      if (eventFilter === 'attending') return isAttending(sale.id);
      return true; // 'all'
    })
    .map(sale => {
      try {
        // Parse date string correctly (date is in YYYY-MM-DD format)
        const [year, month, day] = sale.date.split('-').map(Number);
        return new Date(year, month - 1, day);
      } catch (e) {
        return null;
      }
    })
    .filter(date => date !== null);

  // Filter sales for selected date
  const salesForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    
    return allSales.filter(sale => {
      if (!sale.date) return false;
      
      try {
        // Parse the sale date correctly
        const [year, month, day] = sale.date.split('-').map(Number);
        const saleDate = new Date(year, month - 1, day);
        
        // Compare dates
        if (!isSameDay(saleDate, selectedDate)) return false;
        
        // Apply filters
        if (eventFilter === 'favorites' && !isFavorited(sale.id)) return false;
        if (eventFilter === 'attending' && !isAttending(sale.id)) return false;
        if (categoryFilter !== 'all' && !sale.categories?.includes(categoryFilter)) return false;
        
        return true;
      } catch (e) {
        return false;
      }
    });
  }, [selectedDate, allSales, eventFilter, categoryFilter, favorites, attendances]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const modifiers = {
    hasEvent: datesWithEvents,
  };

  const modifiersStyles = {
    hasEvent: {
      fontWeight: 'bold',
      textDecoration: 'underline',
      color: '#000',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Yard Sale Calendar</h1>
          <p className="text-gray-600">Browse upcoming yard sales by date</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Calendar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Select a Date
                </CardTitle>
                <div className="space-y-3 mt-4">
                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter events" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      {user && (
                        <>
                          <SelectItem value="favorites">My Favorites</SelectItem>
                          <SelectItem value="attending">I'm Attending</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                  className="rounded-md border"
                />
                
                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span>Selected Date</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white border-2 border-gray-300 rounded-full font-bold"></div>
                    <span className="font-bold underline">Dates with Events</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Events List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {selectedDate 
                      ? `Events on ${format(selectedDate, 'MMMM d, yyyy')}`
                      : 'Select a date to view events'}
                  </span>
                  {selectedDate && salesForSelectedDate.length > 0 && (
                    <Badge variant="secondary">{salesForSelectedDate.length} events</Badge>
                  )}
                </CardTitle>
                {selectedDate && salesForSelectedDate.length > 0 && (
                  <div className="mt-4">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="toys">Toys</SelectItem>
                        <SelectItem value="antiques">Antiques</SelectItem>
                        <SelectItem value="books">Books</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="multi-family">Multi-Family</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {!selectedDate ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Select a date from the calendar to view yard sales</p>
                  </div>
                ) : salesForSelectedDate.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📅</div>
                    <p className="text-gray-500 text-lg font-medium mb-2">No events on this date</p>
                    <p className="text-gray-400">Try selecting another date with events</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {salesForSelectedDate.map((sale) => (
                      <YardSaleCard 
                        key={sale.id} 
                        sale={sale}
                        isFavorited={isFavorited(sale.id)}
                        isAttending={isAttending(sale.id)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}