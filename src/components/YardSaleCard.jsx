import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function YardSaleCard({ sale, isFavorited, isAttending }) {
  const categoryColors = {
    general: 'bg-gray-100 text-gray-800',
    furniture: 'bg-amber-100 text-amber-800',
    clothing: 'bg-pink-100 text-pink-800',
    electronics: 'bg-blue-100 text-blue-800',
    toys: 'bg-purple-100 text-purple-800',
    antiques: 'bg-orange-100 text-orange-800',
    books: 'bg-green-100 text-green-800',
    sports: 'bg-red-100 text-red-800',
    'multi-family': 'bg-indigo-100 text-indigo-800',
  };

  return (
    <Link to={createPageUrl(`YardSaleDetails?id=${sale.id}`)}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {sale.photos && sale.photos.length > 0 && (
              <img
                src={sale.photos[0]}
                alt={sale.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-lg truncate">{sale.title}</h3>
                <div className="flex gap-1">
                  {isFavorited && <Heart className="w-4 h-4 text-red-500 fill-red-500" />}
                  {isAttending && <Users className="w-4 h-4 text-blue-500 fill-blue-500" />}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{sale.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {sale.categories?.map((category) => (
                  <Badge 
                    key={category} 
                    className={categoryColors[category] || categoryColors.general}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{sale.general_location}, {sale.city}</span>
                </div>
                {sale.start_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{sale.start_time} - {sale.end_time}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}