import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  MapPin, Calendar, Clock, Image as ImageIcon, Upload, X, 
  Check, Loader2, ArrowLeft, Plus, Info 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const categories = [
  { value: 'general', label: 'General' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'toys', label: 'Toys & Kids' },
  { value: 'antiques', label: 'Antiques' },
  { value: 'books', label: 'Books & Media' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'multi-family', label: 'Multi-Family' },
];

export default function AddYardSale() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    start_time: '08:00',
    end_time: '14:00',
    general_location: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    category: 'general',
    address_unlock_hours: 24,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        setIsAuthenticated(isAuth);
        if (isAuth) {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
        }
      } catch (e) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      // Geocode the address to get coordinates
      let coordinates = {};
      try {
        const query = `${data.address}, ${data.city}, ${data.state} ${data.zip_code}`;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
        );
        const geoData = await response.json();
        
        if (geoData.length > 0) {
          const exactLat = parseFloat(geoData[0].lat);
          const exactLon = parseFloat(geoData[0].lon);
          
          // Create approximate coordinates (offset by ~0.01 degrees = ~1km for privacy)
          const latOffset = (Math.random() - 0.5) * 0.02;
          const lonOffset = (Math.random() - 0.5) * 0.02;
          
          coordinates = {
            exact_latitude: exactLat,
            exact_longitude: exactLon,
            latitude: exactLat + latOffset,
            longitude: exactLon + lonOffset,
          };
        }
      } catch (error) {
        console.error('Geocoding failed:', error);
        toast.error('Could not locate address on map, but sale will still be created');
      }
      
      return await base44.entities.YardSale.create({
        ...data,
        ...coordinates,
        photos: photos,
        status: 'approved',
        views: 0,
      });
    },
    onSuccess: () => {
      toast.success('Your yard sale has been submitted for review!');
      setStep(4); // Success step
    },
    onError: (error) => {
      toast.error('Failed to submit. Please try again.');
    },
  });

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    for (const file of files) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setPhotos(prev => [...prev, file_url]);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    setIsUploading(false);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    createMutation.mutate(formData);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStep1Valid = formData.title && formData.date && formData.category;
  const isStep2Valid = formData.general_location && formData.address && formData.city && formData.state && formData.zip_code;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-[#FF6F61]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10 text-[#FF6F61]" />
          </div>
          <h2 
            className="text-2xl font-bold text-[#2E3A59] mb-3"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Sign In to List Your Sale
          </h2>
          <p className="text-gray-600 mb-6">
            Create an account to list your yard sale and reach thousands of local shoppers.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => base44.auth.redirectToLogin()}
            className="w-full py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Sign In or Create Account
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Button */}
        <Link to={createPageUrl('Home')}>
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-gray-600 hover:text-[#FF6F61] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 
            className="text-3xl font-bold text-[#2E3A59] mb-2"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Add Your Yard Sale
          </h1>
          <p className="text-gray-600">List your sale in just a few steps</p>
        </motion.div>

        {/* Progress Steps */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <motion.div
                  animate={{ 
                    scale: step === s ? 1.1 : 1,
                    backgroundColor: step >= s ? '#FF6F61' : '#e5e7eb'
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{ color: step >= s ? 'white' : '#9ca3af' }}
                >
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </motion.div>
                {s < 3 && (
                  <div className={`w-12 h-1 mx-2 rounded-full ${step > s ? 'bg-[#FF6F61]' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-lg"
            >
              <h2 
                className="text-xl font-bold text-[#2E3A59] mb-6"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Sale Details
              </h2>

              <div className="space-y-5">
                <div>
                  <Label className="text-[#2E3A59] font-medium mb-2 block">Title *</Label>
                  <Input
                    placeholder="e.g., Big Family Yard Sale!"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] py-6"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#2E3A59] font-medium mb-2 block">Date *</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => updateField('date', e.target.value)}
                      className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] py-6"
                    />
                  </div>
                  <div>
                    <Label className="text-[#2E3A59] font-medium mb-2 block">Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => updateField('category', value)}
                    >
                      <SelectTrigger className="rounded-xl border-gray-200 py-6">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#2E3A59] font-medium mb-2 block">Start Time</Label>
                    <Input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => updateField('start_time', e.target.value)}
                      className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] py-6"
                    />
                  </div>
                  <div>
                    <Label className="text-[#2E3A59] font-medium mb-2 block">End Time</Label>
                    <Input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => updateField('end_time', e.target.value)}
                      className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] py-6"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-[#2E3A59] font-medium mb-2 block">Description</Label>
                  <Textarea
                    placeholder="What items will you be selling? Any special deals?"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] min-h-[120px]"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!isStep1Valid}
                onClick={() => setStep(2)}
                className="w-full mt-6 py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Continue
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-lg"
            >
              <h2 
                className="text-xl font-bold text-[#2E3A59] mb-6"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Location
              </h2>

              <div className="space-y-5">
                <div>
                  <Label className="text-[#2E3A59] font-medium mb-2 flex items-center gap-2">
                    General Location (Public) *
                    <span className="text-xs text-gray-500 font-normal">(e.g., "Near Bedford Ave & N 7th St")</span>
                  </Label>
                  <Input
                    placeholder="Near Main St & Oak Ave"
                    value={formData.general_location}
                    onChange={(e) => updateField('general_location', e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] py-6"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This approximate location will be shown publicly for privacy
                  </p>
                </div>

                <div>
                  <Label className="text-[#2E3A59] font-medium mb-2 flex items-center gap-2">
                    Exact Street Address (Private) *
                    <span className="text-xs text-green-600 font-normal">🔒 Protected</span>
                  </Label>
                  <Input
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] py-6"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Exact address unlocks 24 hours before sale or when users click "I'm Attending"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#2E3A59] font-medium mb-2 block">City *</Label>
                    <Input
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] py-6"
                    />
                  </div>
                  <div>
                    <Label className="text-[#2E3A59] font-medium mb-2 block">State *</Label>
                    <Input
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] py-6"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-[#2E3A59] font-medium mb-2 block">ZIP Code *</Label>
                  <Input
                    placeholder="12345"
                    value={formData.zip_code}
                    onChange={(e) => updateField('zip_code', e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] py-6 max-w-[200px]"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 py-6 rounded-xl"
                >
                  Back
                </Button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!isStep2Valid}
                  onClick={() => setStep(3)}
                  className="flex-1 py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Photos */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-lg"
            >
              <h2 
                className="text-xl font-bold text-[#2E3A59] mb-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Add Photos (Optional)
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Photos help attract more buyers to your sale
              </p>

              {/* Photo Upload Area */}
              <div className="mb-6">
                <label className="block">
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-[#FF6F61] transition-colors">
                    {isUploading ? (
                      <Loader2 className="w-10 h-10 text-[#FF6F61] mx-auto animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">Click to upload photos</p>
                        <p className="text-gray-400 text-sm mt-1">PNG, JPG up to 10MB</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>

              {/* Uploaded Photos */}
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {photos.map((photo, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square rounded-xl overflow-hidden"
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Notice */}
              <div className="bg-green-50 rounded-xl p-4 mb-6 flex items-start gap-3">
                <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  Your listing will go live immediately after submission!
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 py-6 rounded-xl"
                >
                  Back
                </Button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={createMutation.isPending}
                  onClick={handleSubmit}
                  className="flex-1 py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Listing'
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 shadow-lg text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-green-500" />
              </motion.div>
              
              <h2 
                className="text-2xl font-bold text-[#2E3A59] mb-3"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Sale is Live!
              </h2>
              <p className="text-gray-600 mb-6">
                Your yard sale is now visible to everyone. Start getting shoppers!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={createPageUrl('Home')} className="flex-1">
                  <Button variant="outline" className="w-full py-6 rounded-xl">
                    Go Home
                  </Button>
                </Link>
                <Link to={createPageUrl('YardSales')} className="flex-1">
                  <Button className="w-full py-6 rounded-xl bg-[#FF6F61] hover:bg-[#e55a4d]">
                    Browse Sales
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}