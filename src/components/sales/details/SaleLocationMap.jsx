import React from 'react';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function SaleLocationMap({ sale, exactVisible, t }) {
  if (!sale.latitude || !sale.longitude) return null;
  const lat = exactVisible ? (sale.exact_latitude || sale.latitude) : sale.latitude;
  const lng = exactVisible ? (sale.exact_longitude || sale.longitude) : sale.longitude;

  return (
    <div className="bg-card border border-border p-5 rounded-2xl shadow-card relative z-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-semibold text-foreground">{t('locationMap')}</h3>
        {!exactVisible && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {t('approximateArea')}
          </span>
        )}
      </div>
      <div className="h-64 rounded-xl overflow-hidden">
        <MapContainer center={[lat, lng]} zoom={exactVisible ? 16 : 14} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
          <TileLayer attribution='&copy; <a href="https://maps.google.com">Google Maps</a>' url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" maxZoom={20} />
          {exactVisible ? (
            <Marker position={[lat, lng]}><Popup>{sale.title}</Popup></Marker>
          ) : (
            <Circle center={[lat, lng]} radius={500} pathOptions={{ color: '#0984E3', fillColor: '#0984E3', fillOpacity: 0.15 }} />
          )}
        </MapContainer>
      </div>
      {!exactVisible && (
        <p className="text-xs text-muted-foreground mt-2 text-center">{t('exactLocationNote')}</p>
      )}
    </div>
  );
}