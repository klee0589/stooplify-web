import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, Tag, Plus, Trash2, Bell } from 'lucide-react';
import { toast } from "sonner";

const distances = [
  { value: '1', label: 'Within 1 mile' },
  { value: '3', label: 'Within 3 miles' },
  { value: '5', label: 'Within 5 miles' },
  { value: '10', label: 'Within 10 miles' },
  { value: '25', label: 'Within 25 miles' },
];

const categories = [
  { value: 'furniture', label: 'Furniture' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'toys', label: 'Kids & Toys' },
  { value: 'antiques', label: 'Vintage & Antiques' },
  { value: 'books', label: 'Books' },
  { value: 'multi-family', label: 'Multi-Family Sales' },
];

export default function AlertSettings({ userEmail }) {
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [alertType, setAlertType] = useState('distance');
  const [alertValue, setAlertValue] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
          toast.error("Could not get your location for distance alerts.");
        }
      );
    }
  }, []);

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alertPreferences', userEmail],
    queryFn: async () => {
      return await base44.entities.AlertPreference.filter({ user_email: userEmail });
    },
  });

  const createAlertMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.AlertPreference.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertPreferences', userEmail] });
      toast.success('Alert added!');
      setShowAddAlert(false);
      setAlertValue('');
    },
  });

  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId) => {
      return await base44.entities.AlertPreference.delete(alertId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertPreferences', userEmail] });
      toast.success('Alert removed');
    },
  });

  const toggleAlertMutation = useMutation({
    mutationFn: async ({ id, is_active }) => {
      return await base44.entities.AlertPreference.update(id, { is_active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertPreferences', userEmail] });
      toast.success('Alert updated');
    },
  });

  const handleAddAlert = () => {
    if (!alertValue) return;
    
    // Check for duplicates
    const exists = alerts.some(
      a => a.alert_type === alertType && a.value === alertValue
    );
    
    if (exists) {
      toast.error('You already have this alert');
      return;
    }

    const newAlert = {
      user_email: userEmail,
      alert_type: alertType,
      value: alertValue,
      is_active: true,
    };

    if (alertType === 'distance' && userLocation) {
      newAlert.latitude = userLocation.latitude;
      newAlert.longitude = userLocation.longitude;
    } else if (alertType === 'distance' && !userLocation) {
      toast.error('Cannot add distance alert without your location.');
      return;
    }

    createAlertMutation.mutate(newAlert);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-[#14B8FF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#2E3A59] dark:text-white">Smart Alerts</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when new sales match your criteria</p>
        </div>
        <Button
          onClick={() => setShowAddAlert(!showAddAlert)}
          size="sm"
          className="bg-[#14B8FF] hover:bg-[#0da3e6]"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Alert
        </Button>
      </div>

      {showAddAlert && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <div className="flex gap-2">
            <Select value={alertType} onValueChange={setAlertType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>

            {alertType === 'distance' ? (
              <Select value={alertValue} onValueChange={setAlertValue}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select distance" />
                </SelectTrigger>
                <SelectContent>
                  {distances.map(d => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select value={alertValue} onValueChange={setAlertValue}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              onClick={handleAddAlert}
              disabled={!alertValue || createAlertMutation.isPending}
            >
              {createAlertMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
            </Button>
          </div>
        </div>
      )}

      {alerts.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No alerts configured yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Add an alert to get notified about new sales
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1">
                {alert.alert_type === 'distance' ? (
                  <MapPin className="w-5 h-5 text-[#14B8FF]" />
                ) : (
                  <Tag className="w-5 h-5 text-[#F5A623]" />
                )}
                <div>
                  <p className="font-medium text-[#2E3A59] dark:text-white">
                    {alert.alert_type === 'distance'
                      ? `Within ${alert.value} mile${alert.value === '1' ? '' : 's'}`
                      : alert.value.replace('-', ' ')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {alert.alert_type === 'distance' ? 'Distance' : 'Category'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleAlertMutation.mutate({ id: alert.id, is_active: !alert.is_active })}
                  className={alert.is_active ? 'text-green-600' : 'text-gray-400'}
                >
                  {alert.is_active ? 'Active' : 'Paused'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteAlertMutation.mutate(alert.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 You'll receive email alerts when new sales match your preferences
        </p>
      </div>
    </div>
  );
}