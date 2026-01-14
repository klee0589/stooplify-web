import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { MapPin, Plus, Edit2, Trash2, Loader2, ArrowLeft, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from 'date-fns';

export default function AdminCommunityLocations() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    category: 'neighborhood_hub',
    icon: '📍',
    is_active: true,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        setIsAuthenticated(isAuth);
        if (isAuth) {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
          // Check if admin
          if (currentUser.role !== 'admin') {
            setIsAuthenticated(false);
          }
        }
      } catch (e) {
        setIsAuthenticated(false);
      }
      setIsChecking(false);
    };
    checkAuth();
  }, []);

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['communityLocations'],
    queryFn: async () => {
      return await base44.entities.CommunityLocation.list();
    },
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      if (editingId) {
        await base44.entities.CommunityLocation.update(editingId, data);
      } else {
        // Geocode the address
        const query = `${data.address}, ${data.city}, ${data.state} ${data.zip_code}`;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
          { headers: { 'User-Agent': 'Stooplify/1.0' } }
        );
        const geoData = await response.json();
        
        if (geoData.length > 0) {
          data.latitude = parseFloat(geoData[0].lat);
          data.longitude = parseFloat(geoData[0].lon);
        }
        
        await base44.entities.CommunityLocation.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityLocations'] });
      toast.success(editingId ? 'Location updated!' : 'Location created!');
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await base44.entities.CommunityLocation.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityLocations'] });
      toast.success('Location deleted!');
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      category: 'neighborhood_hub',
      icon: '📍',
      is_active: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (location) => {
    setFormData(location);
    setEditingId(location.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.address || !formData.city || !formData.state) {
      toast.error('Please fill in all required fields');
      return;
    }
    createMutation.mutate(formData);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF6F61] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#2E3A59] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Admin Only
          </h2>
          <p className="text-gray-600 mb-6">
            You need admin access to manage community locations.
          </p>
          <Link to={createPageUrl('Home')}>
            <Button className="w-full bg-[#FF6F61] hover:bg-[#e55a4d]">Go Home</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={createPageUrl('Home')}>
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-gray-600 hover:text-[#FF6F61] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-[#2E3A59]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Community Locations
            </h1>
            <p className="text-gray-600 mt-1">Manage neighborhood hubs and popular areas</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#FF6F61] hover:bg-[#e55a4d] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Location
          </Button>
        </motion.div>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg mb-6"
          >
            <h2 className="text-xl font-bold text-[#2E3A59] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {editingId ? 'Edit Location' : 'Add New Location'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2E3A59] mb-1">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Prospect Park Entrance"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E3A59] mb-1">Icon (emoji)</label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="📍"
                  maxLength={2}
                  className="rounded-xl max-w-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E3A59] mb-1">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What makes this location special?"
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2E3A59] mb-1">Category</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neighborhood_hub">Neighborhood Hub</SelectItem>
                      <SelectItem value="popular_area">Popular Area</SelectItem>
                      <SelectItem value="event_venue">Event Venue</SelectItem>
                      <SelectItem value="parking">Parking</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2E3A59] mb-1">Active</label>
                  <Select
                    value={formData.is_active ? 'true' : 'false'}
                    onValueChange={(value) => setFormData({ ...formData, is_active: value === 'true' })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E3A59] mb-1">Address *</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address"
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2E3A59] mb-1">City *</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2E3A59] mb-1">State *</label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2E3A59] mb-1">ZIP</label>
                  <Input
                    value={formData.zip_code}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    placeholder="ZIP"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending}
                  className="flex-1 bg-[#FF6F61] hover:bg-[#e55a4d] rounded-xl"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Locations List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-[#FF6F61] animate-spin" />
            </div>
          ) : locations.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No community locations yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {locations.map((location) => (
                <motion.div
                  key={location.id}
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{location.icon}</span>
                    <div>
                      <p className="font-medium text-[#2E3A59]">{location.name}</p>
                      <p className="text-sm text-gray-600">
                        {location.address}, {location.city}, {location.state}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {location.category.replace(/_/g, ' ')}
                        </span>
                        {!location.is_active && (
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(location)}
                      className="rounded-lg"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm('Delete this location?')) {
                          deleteMutation.mutate(location.id);
                        }
                      }}
                      className="rounded-lg text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}