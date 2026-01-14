import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  MapPin, Calendar, Clock, Image as ImageIcon, Upload, X, 
  Check, Loader2, ArrowLeft, Plus, Info, Camera 
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
  const urlParams = new URLSearchParams(window.location.search);
  const editSaleId = urlParams.get('edit');
  const isEditMode = !!editSaleId;
  
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [needsPayment, setNeedsPayment] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isLoadingSale, setIsLoadingSale] = useState(isEditMode);
  const [hasActiveSale, setHasActiveSale] = useState(false);
  const [maxSalesAllowed, setMaxSalesAllowed] = useState(1);
  const [aiDescription, setAiDescription] = useState(null);
  const [showAiPreview, setShowAiPreview] = useState(false);
  const [editableDescription, setEditableDescription] = useState('');
  const [addressValidation, setAddressValidation] = useState({ status: 'idle', message: '' });
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);
  
  const navigate = useNavigate();
  
  // Stripe price IDs (from your Stripe products)
  const SINGLE_LISTING_PRICE_ID = 'price_1Sp0DuEBgBmaTVQEKO1W2NrG';
  const SUBSCRIPTION_PRICE_ID = 'price_1Sp0DuEBgBmaTVQE0iSg1m5n';
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
          
          // Check if payment is needed (not first listing and no subscription) - only for new sales
          if (!isEditMode) {
            // Check actual number of existing sales for this user (not just counter)
            const existingSales = await base44.entities.YardSale.filter({ 
              created_by: currentUser.email,
              status: 'approved' 
            });
            const hasSubscription = currentUser.subscription_active || false;
            
            console.log('🔍 Payment Check:', { 
              userEmail: currentUser.email,
              existingSalesCount: existingSales.length, 
              hasSubscription,
              freeListingsUsed: currentUser.free_listings_used
            });
            
            // Determine max sales allowed based on subscription
            let maxSales = 1; // Free tier: 1 concurrent sale
            if (hasSubscription) {
              maxSales = 3; // Premium tier: 3 concurrent sales
            }
            setMaxSalesAllowed(maxSales);
            
            // Payment only needed if they have existing sales and don't have subscription
            const needsPay = existingSales.length > 0 && !hasSubscription;
            setNeedsPayment(needsPay);
            console.log(needsPay ? '💳 Payment required' : '✅ No payment needed');
            
            // Only block if they're at their limit AND they've already paid (no payment needed)
            if (existingSales.length >= maxSales && !needsPay) {
              console.log('❌ User at sale limit:', existingSales.length, '>=', maxSales);
              setHasActiveSale(true);
            }
          }
          
          // Load existing sale data if editing
          if (isEditMode && editSaleId) {
            const sales = await base44.entities.YardSale.filter({ id: editSaleId });
            if (sales.length > 0) {
              const sale = sales[0];
              setFormData({
                title: sale.title || '',
                description: sale.description || '',
                date: sale.date || '',
                start_time: sale.start_time || '08:00',
                end_time: sale.end_time || '14:00',
                general_location: sale.general_location || '',
                address: sale.address || '',
                city: sale.city || '',
                state: sale.state || '',
                zip_code: sale.zip_code || '',
                category: sale.category || 'general',
                address_unlock_hours: sale.address_unlock_hours || 24,
              });
              setPhotos(sale.photos || []);
            }
            setIsLoadingSale(false);
          }
        }
      } catch (e) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
    
    // Check for payment success/cancel
    const paymentStatus = urlParams.get('payment');
    if (paymentStatus === 'success') {
      toast.success('Payment successful! You can now list your sale.');
      setNeedsPayment(false);
    } else if (paymentStatus === 'cancelled') {
      toast.error('Payment cancelled. Please try again.');
    }
  }, []);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      // Geocode the address to get coordinates
      let coordinates = {};
      
      // Try multiple query formats for better geocoding results
      const queries = [
        `${data.address}, ${data.city}, ${data.state} ${data.zip_code}`,
        `${data.address}, ${data.zip_code}`, // Try with just zip code
        `${data.address}, Brooklyn, NY ${data.zip_code}`, // Try with Brooklyn for NYC neighborhoods
        `${data.address}, New York, NY ${data.zip_code}`, // Try with New York City
      ];
      
      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        console.log(`🌍 Geocoding attempt ${i + 1}:`, query);
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
            {
              headers: {
                'User-Agent': 'Stooplify/1.0'
              }
            }
          );

          if (!response.ok) {
            console.warn(`Geocoding attempt ${i + 1} failed: ${response.status}`);
            continue;
          }

          const geoData = await response.json();
          console.log(`🌍 Geocoding response ${i + 1}:`, geoData);

          if (geoData.length > 0) {
            const exactLat = parseFloat(geoData[0].lat);
            const exactLon = parseFloat(geoData[0].lon);

            console.log('✅ Coordinates found:', { exactLat, exactLon });

            // Create approximate coordinates (offset by ~0.01 degrees = ~1km for privacy)
            const latOffset = (Math.random() - 0.5) * 0.02;
            const lonOffset = (Math.random() - 0.5) * 0.02;

            coordinates = {
              exact_latitude: exactLat,
              exact_longitude: exactLon,
              latitude: exactLat + latOffset,
              longitude: exactLon + lonOffset,
            };

            console.log('📍 Final coordinates:', coordinates);
            break; // Success, exit loop
          } else {
            console.warn(`⚠️ No results for attempt ${i + 1}`);
          }
          
          // Wait a bit between requests to respect rate limits
          if (i < queries.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`❌ Geocoding attempt ${i + 1} error:`, error);
        }
      }
      
      if (!coordinates.latitude) {
        console.error('❌ All geocoding attempts failed');
        toast.error('Could not locate address on map, but sale will still be saved');
      }
      
      if (isEditMode) {
        // Update existing sale
        await base44.entities.YardSale.update(editSaleId, {
          ...data,
          ...coordinates,
          photos: photos,
        });
        return { id: editSaleId };
      } else {
        // Create new sale
        const sale = await base44.entities.YardSale.create({
          ...data,
          ...coordinates,
          photos: photos,
          status: 'approved',
          views: 0,
        });
        
        // Increment free_listings_used
        await base44.auth.updateMe({
          free_listings_used: (user.free_listings_used || 0) + 1,
        });
        
        return sale;
      }
    },
    onSuccess: (data) => {
      toast.success(isEditMode ? 'Your yard sale has been updated!' : 'Your yard sale is now live!');
      // Redirect to the sale details page
      setTimeout(() => {
        navigate(createPageUrl('YardSaleDetails') + `?id=${data.id}`);
      }, 1000);
    },
    onError: (error) => {
      toast.error('Failed to submit. Please try again.');
    },
  });

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    const uploadedUrls = [];
    for (const file of files) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploadedUrls.push(file_url);
        setPhotos(prev => [...prev, file_url]);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    // Generate AI description if we have photos
    if (uploadedUrls.length > 0) {
      const toastId = toast.loading('Generating description from photos...');
      try {
        console.log('🤖 Calling AI with file URLs:', uploadedUrls);
        const generatedDescription = await base44.integrations.Core.InvokeLLM({
          prompt: "Based on these images of yard sale items, write a brief, appealing description (2-3 sentences) of what's being sold. Focus on the main items visible and make it sound inviting to potential buyers.",
          file_urls: uploadedUrls,
        });
        console.log('🤖 AI response:', generatedDescription);
        toast.dismiss(toastId);
        setAiDescription(generatedDescription);
        setEditableDescription(generatedDescription);
        setShowAiPreview(true);
        toast.success('AI generated a description!');
      } catch (error) {
        toast.dismiss(toastId);
        console.error('❌ AI generation failed:', error);
        console.error('Error details:', error.message, error.stack);
        toast.error(`AI Error: ${error.message || 'Could not generate description'}`);
      }
    }
    
    setIsUploading(false);
  };

  const handleCameraCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setPhotos(prev => [...prev, file_url]);
      
      // Generate AI description from photo
      const toastId = toast.loading('Generating description from photo...');
      try {
        console.log('🤖 Calling AI with photo URL:', file_url);
        const generatedDescription = await base44.integrations.Core.InvokeLLM({
          prompt: "Based on this image of yard sale items, write a brief, appealing description (2-3 sentences) of what's being sold. Focus on the main items visible and make it sound inviting to potential buyers.",
          file_urls: [file_url],
        });
        console.log('🤖 AI response:', generatedDescription);
        toast.dismiss(toastId);
        setAiDescription(generatedDescription);
        setEditableDescription(generatedDescription);
        setShowAiPreview(true);
        toast.success('AI generated a description!');
      } catch (error) {
        toast.dismiss(toastId);
        console.error('❌ AI generation failed:', error);
        console.error('Error details:', error.message, error.stack);
        toast.error(`AI Error: ${error.message || 'Could not generate description'}`);
      }
    } catch (error) {
      toast.error('Failed to upload photo');
    }
    
    setIsUploading(false);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = async (priceId, listingType) => {
    setIsCheckingPayment(true);
    try {
      console.log('Starting checkout with:', { priceId, listingType });
      
      // Check if running in iframe
      if (window.self !== window.top) {
        toast.error('Checkout only works from the published app. Please open in a new tab.');
        setIsCheckingPayment(false);
        return;
      }
      
      const response = await base44.functions.invoke('createCheckout', { priceId, listingType });
      console.log('Full checkout response:', response);
      console.log('Response data:', response?.data);
      console.log('Response data.url:', response?.data?.url);
      
      const checkoutUrl = response?.data?.url;
      if (checkoutUrl) {
        console.log('Redirecting to:', checkoutUrl);
        window.location.href = checkoutUrl;
      } else {
        console.error('No checkout URL in response:', response);
        toast.error('Failed to create checkout session - no URL returned');
        setIsCheckingPayment(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      console.error('Error message:', error?.message);
      console.error('Error response:', error?.response);
      toast.error(error?.message || 'Failed to create checkout session');
      setIsCheckingPayment(false);
    }
  };

  const handleSubmit = () => {
    createMutation.mutate(formData);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Trigger address validation when relevant fields change
    if (['address', 'city', 'state', 'zip_code'].includes(field)) {
      validateAddressDebounced();
    }
  };

  const validateAddress = async () => {
    const { address, city, state, zip_code } = formData;
    
    // Skip if not enough info
    if (!address || !zip_code) {
      setAddressValidation({ status: 'idle', message: '' });
      return;
    }
    
    setIsValidatingAddress(true);
    setAddressValidation({ status: 'checking', message: 'Checking address...' });
    
    try {
      const query = `${address}, ${city || ''}, ${state || ''} ${zip_code}`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'Stooplify/1.0' } }
      );
      
      const geoData = await response.json();
      
      if (geoData.length > 0) {
        setAddressValidation({ 
          status: 'valid', 
          message: `✓ Address found: ${geoData[0].display_name}` 
        });
      } else {
        setAddressValidation({ 
          status: 'invalid', 
          message: '⚠️ Address not found - please check spelling' 
        });
      }
    } catch (error) {
      setAddressValidation({ 
        status: 'error', 
        message: '⚠️ Could not verify address' 
      });
    } finally {
      setIsValidatingAddress(false);
    }
  };

  // Debounce address validation
  const validateAddressDebounced = (() => {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(validateAddress, 1000);
    };
  })();

  const isStep1Valid = formData.title && formData.date && formData.category;
  const isStep2Valid = formData.general_location && formData.address && formData.city && formData.state && formData.zip_code;

  if (isLoadingSale) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex items-center justify-center">
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

  if (hasActiveSale && !isEditMode) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-[#F5A623]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-10 h-10 text-[#F5A623]" />
          </div>
          <h2 
            className="text-2xl font-bold text-[#2E3A59] mb-3"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            You've Reached Your Limit
          </h2>
          <p className="text-gray-600 mb-6">
            You currently have {maxSalesAllowed} active sale{maxSalesAllowed > 1 ? 's' : ''}. 
            {maxSalesAllowed === 1 ? ' Upgrade to post up to 3 concurrent sales!' : ' Delete an existing sale to post a new one, or wait for one to expire.'}
          </p>
          <div className="flex flex-col gap-3">
            {maxSalesAllowed === 1 && (
              <Link to={createPageUrl('Pricing')}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Upgrade to Premium
                </motion.button>
              </Link>
            )}
            <Link to={createPageUrl('Profile')}>
              <Button variant="outline" className="w-full py-6 rounded-xl">
                Manage My Sales
              </Button>
            </Link>
          </div>
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
            {isEditMode ? 'Edit Your Yard Sale' : 'Add Your Yard Sale'}
          </h1>
          <p className="text-gray-600">{isEditMode ? 'Update your sale details' : 'List your sale in just a few steps'}</p>
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

                {/* AI Description Preview Modal */}
                {showAiPreview && aiDescription && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#2E3A59] mb-1">AI Generated Description</h4>
                        <p className="text-sm text-gray-700">{aiDescription}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          updateField('description', aiDescription);
                          setShowAiPreview(false);
                          toast.success('Description added!');
                        }}
                        className="flex-1 bg-blue-500 hover:bg-blue-600"
                      >
                        Use This Description
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowAiPreview(false);
                          toast('You can edit the description above');
                        }}
                        className="flex-1"
                      >
                        Edit Manually
                      </Button>
                    </div>
                  </motion.div>
                )}
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
                  <div className="relative">
                    <Input
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      className={`rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] py-6 ${
                        addressValidation.status === 'valid' ? 'border-green-500' : 
                        addressValidation.status === 'invalid' ? 'border-red-500' : ''
                      }`}
                    />
                    {isValidatingAddress && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                    )}
                  </div>
                  {addressValidation.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-xs mt-1 ${
                        addressValidation.status === 'valid' ? 'text-green-600' :
                        addressValidation.status === 'invalid' ? 'text-red-600' :
                        'text-gray-500'
                      }`}
                    >
                      {addressValidation.message}
                    </motion.p>
                  )}
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

          {/* Step 3: Photos or Payment */}
          {step === 3 && needsPayment && (
            <motion.div
              key="step3-payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-lg"
            >
              <h2 
                className="text-xl font-bold text-[#2E3A59] mb-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Choose Your Listing Option
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Your first listing was free! Choose how to continue:
              </p>

              <div className="space-y-4 mb-6">
                {/* Single Listing */}
                <motion.button
                  whileHover={{ scale: isCheckingPayment ? 1 : 1.02 }}
                  className={`w-full border-2 border-gray-200 rounded-2xl p-6 text-left hover:border-[#FF6F61] transition-all ${
                    isCheckingPayment ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  onClick={() => !isCheckingPayment && handleCheckout(SINGLE_LISTING_PRICE_ID, 'single')}
                  disabled={isCheckingPayment}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[#2E3A59]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Single Listing
                    </h3>
                    <span className="text-2xl font-bold text-[#FF6F61]">$4</span>
                  </div>
                  <p className="text-gray-600 text-sm">Pay once for this listing</p>
                </motion.button>

                {/* Unlimited Subscription */}
                <motion.button
                  whileHover={{ scale: isCheckingPayment ? 1 : 1.02 }}
                  className={`w-full border-2 border-[#FF6F61] bg-[#FF6F61]/5 rounded-2xl p-6 text-left transition-all relative overflow-hidden ${
                    isCheckingPayment ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  onClick={() => !isCheckingPayment && handleCheckout(SUBSCRIPTION_PRICE_ID, 'subscription')}
                  disabled={isCheckingPayment}
                >
                  <div className="absolute top-2 right-2 bg-[#F5A623] text-white text-xs font-bold px-3 py-1 rounded-full">
                    BEST VALUE
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[#2E3A59]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Unlimited Listings
                    </h3>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[#FF6F61]">$9</span>
                      <span className="text-gray-600 text-sm ml-1">/month</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Post as many sales as you want for 30 days</p>
                </motion.button>
              </div>

              {isCheckingPayment && (
                <div className="flex items-center justify-center gap-2 text-[#FF6F61] mb-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-medium">Redirecting to checkout...</span>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 py-6 rounded-xl"
                  disabled={isCheckingPayment}
                >
                  Back
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Photos */}
          {step === 3 && !needsPayment && (
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
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-[#FF6F61] transition-colors">
                      {isUploading ? (
                        <Loader2 className="w-8 h-8 text-[#FF6F61] mx-auto animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 font-medium text-sm">Upload Photos</p>
                          <p className="text-gray-400 text-xs mt-1">From gallery</p>
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

                  <label className="block">
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-[#14B8FF] transition-colors">
                      {isUploading ? (
                        <Loader2 className="w-8 h-8 text-[#14B8FF] mx-auto animate-spin" />
                      ) : (
                        <>
                          <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 font-medium text-sm">Take Photo</p>
                          <p className="text-gray-400 text-xs mt-1">Use camera</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleCameraCapture}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  📸 AI will generate a description from your photos
                </p>
              </div>

              {/* AI Description Preview */}
              {showAiPreview && aiDescription && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#2E3A59] mb-2">AI Generated Description</h4>
                      <Textarea
                        value={editableDescription}
                        onChange={(e) => setEditableDescription(e.target.value)}
                        className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[100px] bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        updateField('description', editableDescription);
                        setShowAiPreview(false);
                        toast.success('Description added!');
                      }}
                      className="flex-1 bg-blue-500 hover:bg-blue-600"
                    >
                      Use This Description
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAiPreview(false);
                        toast('You can add your own description in step 1');
                      }}
                      className="flex-1"
                    >
                      Skip for Now
                    </Button>
                  </div>
                </motion.div>
              )}

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

          {/* Step 4: Success - This is just a brief loading state before redirect */}
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
                {isEditMode ? 'Sale Updated!' : 'Sale is Live!'}
              </h2>
              <p className="text-gray-600 mb-6">
                Redirecting to your sale page...
              </p>
              
              <Loader2 className="w-8 h-8 text-[#FF6F61] animate-spin mx-auto" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}