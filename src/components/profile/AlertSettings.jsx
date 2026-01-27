import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Bell, Plus, X, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const neighborhoods = [
  'Bushwick',
  'Williamsburg',
  'Greenpoint',
  'Bedford-Stuyvesant',
  'Crown Heights',
  'Park Slope',
  'Prospect Heights',
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
  const [alertType, setAlertType] = useState('neighborhood');
  const [alertValue, setAlertValue] = useState('');
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alertPreferences', userEmail],
    queryFn: () => base44.entities.AlertPreference.filter({ user_email: userEmail }),
    enabled: !!userEmail,
  });

  const createAlertMutation = useMutation({
    mutationFn: (data) => base44.entities.AlertPreference.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertPreferences'] });
      toast.success('Alert added!');
      setShowAddAlert(false);
      setAlertValue('');
    },
    onError: () => {
      toast.error('Failed to add alert');
    },
  });

  const deleteAlertMutation = useMutation({
    mutationFn: (id) => base44.entities.AlertPreference.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertPreferences'] });
      toast.success('Alert removed');
    },
  });

  const toggleAlertMutation = useMutation({
    mutationFn: ({ id, isActive }) => 
      base44.entities.AlertPreference.update(id, { is_active: !isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertPreferences'] });
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

    createAlertMutation.mutate({
      user_email: userEmail,
      alert_type: alertType,
      value: alertValue,
      is_active: true,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#14B8FF]/10 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-[#14B8FF]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#2E3A59] dark:text-white">
              Smart Alerts
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get notified about sales you care about
            </p>
          </div>
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

      {/* Add Alert Form */}
      {showAddAlert && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl"
        >
          <div className="flex gap-3 mb-3">
            <Select value={alertType} onValueChange={setAlertType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neighborhood">Neighborhood</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>

            {alertType === 'neighborhood' ? (
              <Select value={alertValue} onValueChange={setAlertValue}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select neighborhood" />
                </SelectTrigger>
                <SelectContent>
                  {neighborhoods.map(n => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
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
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAddAlert}
              disabled={!alertValue || createAlertMutation.isPending}
              className="flex-1 bg-[#14B8FF] hover:bg-[#0da3e6]"
            >
              {createAlertMutation.isPending ? 'Adding...' : 'Add Alert'}
            </Button>
            <Button
              onClick={() => setShowAddAlert(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Alert List */}
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No alerts set up yet</p>
          <p className="text-sm">Get notified when new sales match your interests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                alert.is_active
                  ? 'bg-[#14B8FF]/5 border-[#14B8FF]/20'
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleAlertMutation.mutate({ id: alert.id, isActive: alert.is_active })}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    alert.is_active
                      ? 'bg-[#14B8FF] border-[#14B8FF]'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {alert.is_active && <Bell className="w-3 h-3 text-white" />}
                </button>
                <div>
                  <p className="font-medium text-[#2E3A59] dark:text-white capitalize">
                    {alert.value.replace('-', ' ')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {alert.alert_type === 'neighborhood' ? 'Neighborhood' : 'Category'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteAlertMutation.mutate(alert.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>📧 Email alerts:</strong> We'll send you a weekly roundup of new sales matching your preferences. 
          You'll never miss a great find!
        </p>
      </div>
    </div>
  );
}