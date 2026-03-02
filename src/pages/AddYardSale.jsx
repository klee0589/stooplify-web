import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  MapPin, Calendar, Clock, Image as ImageIcon, Upload, X,
  Check, Loader2, ArrowLeft, Plus, Info, Camera, DollarSign, CreditCard, Smartphone,
  Package, Sofa, Shirt, Zap, Baby, Crown, BookOpen, Dumbbell, Users } from
'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useTranslation } from '../components/translations';
import SEO from '../components/SEO';
import { DrawerSelect } from '@/components/ui/drawer-select';

export default function AddYardSale() {
  const urlParams = new URLSearchParams(window.location.search);
  const editSaleId = urlParams.get('edit');
  const isEditMode = !!editSaleId;
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);

    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const t = useTranslation(language);

  const getCategoryLabels = () => [
  { value: 'general', label: t('general'), icon: Package },
  { value: 'furniture', label: t('furniture'), icon: Sofa },
  { value: 'clothing', label: t('clothing'), icon: Shirt },
  { value: 'electronics', label: t('electronics'), icon: Zap },
  { value: 'toys', label: t('toysKids'), icon: Baby },
  { value: 'antiques', label: t('antiques'), icon: Crown },
  { value: 'books', label: t('booksMedia'), icon: BookOpen },
  { value: 'sports', label: t('sportsOutdoors'), icon: Dumbbell },
  { value: 'multi-family', label: t('multiFamily'), icon: Users }];


  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [needsPayment, setNeedsPayment] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isLoadingSale, setIsLoadingSale] = useState(isEditMode);
  const [aiDescription, setAiDescription] = useState(null);
  const [showAiPreview, setShowAiPreview] = useState(false);
  const [editableDescription, setEditableDescription] = useState('');
  const [addressValidation, setAddressValidation] = useState({ status: 'idle', message: '' });
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);

  const navigate = useNavigate();

  // Stripe price IDs (from your Stripe products)
  const SINGLE_LISTING_PRICE_ID = 'price_1Sp0DuEBgBmaTVQEKO1W2NrG'; // $4 one-time
  const SUBSCRIPTION_PRICE_ID = 'price_1Sp0DuEBgBmaTVQE0iSg1m5n'; // $9/month
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
    categories: ['general'],
    address_unlock_hours: 0,
    payment_cash: true,
    payment_card: false,
    payment_digital: false,
    cash_preferred: false
  });

  useEffect(() => {
    // Track page view
    base44.analytics.track({
      eventName: isEditMode ? 'edit_sale_page_viewed' : 'add_sale_page_viewed'
    });
  }, []);

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
             const isAdmin = currentUser.role === 'admin';
             const hasSubscription = currentUser.subscription_active || false;
             const hasUsedFreeListing = (currentUser.free_listings_used || 0) >= 1;

             // Admins don't need payment, payment needed if: they've used free listing AND don't have subscription
             const needsPay = !isAdmin && hasUsedFreeListing && !hasSubscription;
             setNeedsPayment(needsPay);

             // If they have no subscription and have used their free listing, redirect to MyYardSales with explanation
             if (needsPay) {
               toast.error("You've used your free listing. Please upgrade to post more sales.", { duration: 6000 });
               navigate(createPageUrl('MyYardSales') + '?upgrade=true');
               return;
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
                categories: sale.categories || (sale.category ? [sale.category] : ['general']),
                address_unlock_hours: sale.address_unlock_hours || 0,
                payment_cash: sale.payment_cash ?? true,
                payment_card: sale.payment_card ?? false,
                payment_digital: sale.payment_digital ?? false,
                cash_preferred: sale.cash_preferred ?? false
              });
              setPhotos(sale.photos || []);

              // Populate AI description with existing description when editing
              if (sale.description) {
                setAiDescription(sale.description);
                setEditableDescription(sale.description);
              }
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
      // For new listings only, verify user is within 0.5 miles of the address
      if (!isEditMode) {
        const position = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
        );
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        // Geocode the address first to get its coordinates for distance check
        const geoCheckQuery = `${data.address}, ${data.city}, ${data.state} ${data.zip_code}`;
        const geoCheckRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(geoCheckQuery)}&format=json&limit=1`,
          { headers: { 'User-Agent': 'Stooplify/1.0' } }
        );
        const geoCheckData = await geoCheckRes.json();

        if (geoCheckData.length > 0) {
          const addrLat = parseFloat(geoCheckData[0].lat);
          const addrLon = parseFloat(geoCheckData[0].lon);
          const R = 3958.8;
          const dLat = (addrLat - userLat) * Math.PI / 180;
          const dLon = (addrLon - userLon) * Math.PI / 180;
          const a = Math.sin(dLat/2) ** 2 +
            Math.cos(userLat * Math.PI / 180) * Math.cos(addrLat * Math.PI / 180) * Math.sin(dLon/2) ** 2;
          const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          if (distance > 0.5) {
            toast.error(`You must be within 0.5 miles of the sale address to create a listing. You are ${distance.toFixed(1)} miles away.`);
            throw new Error('Too far from event location');
          }
        }
      }

      // Geocode the address to get coordinates
      let coordinates = {};

      // Try multiple query formats for better geocoding results
      const queries = [
        `${data.address}, ${data.city}, ${data.state} ${data.zip_code}`,
        `${data.address}, ${data.zip_code}`,
        `${data.address}, ${data.city}, ${data.state}`,
        `${data.city}, ${data.state} ${data.zip_code}`,
        `${data.city}, ${data.state}`,
        `${data.address}`
      ].filter(q => q.trim());

      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
            {
              headers: {
                'User-Agent': 'Stooplify/1.0'
              }
            }
          );

          if (!response.ok) {
            continue;
          }

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
              longitude: exactLon + lonOffset
            };

            break; // Success, exit loop
          }

          // Wait a bit between requests to respect rate limits
          if (i < queries.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        } catch (error) {
          // Continue to next query on error
        }
      }

      if (!coordinates.latitude) {
        toast.error('Could not locate address. Please check the address and try again.');
        throw new Error('Could not locate address');
      }

      if (isEditMode) {
        // Update existing sale
        await base44.entities.YardSale.update(editSaleId, {
          ...data,
          ...coordinates,
          photos: photos
        });
        return { id: editSaleId };
      } else {
        // Create new sale
        const sale = await base44.entities.YardSale.create({
          ...data,
          ...coordinates,
          photos: photos,
          status: 'approved',
          views: 0
        });

        // Increment free_listings_used
        await base44.auth.updateMe({
          free_listings_used: (user.free_listings_used || 0) + 1
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
    }
  });

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    base44.analytics.track({
      eventName: 'photos_uploaded',
      properties: { count: files.length }
    });

    const photoLimit = user?.subscription_active ? 10 : 3;
    const remainingSlots = photoLimit - photos.length;

    if (remainingSlots <= 0) {
      toast.error(user?.subscription_active ? 'Maximum 10 photos allowed' : 'Maximum 3 photos for free users. Upgrade to Premium for up to 10 photos.');
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      toast.warning(`Only ${remainingSlots} photo${remainingSlots === 1 ? '' : 's'} remaining. ${user?.subscription_active ? '' : 'Upgrade for more.'}`);
    }

    setIsUploading(true);

    const uploadedUrls = [];
    for (const file of filesToUpload) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploadedUrls.push(file_url);
        setPhotos((prev) => [...prev, file_url]);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    // Generate AI description if we have photos
    if (uploadedUrls.length > 0) {
      const toastId = toast.loading('Generating description from photos...');
      try {
        const generatedDescription = await base44.integrations.Core.InvokeLLM({
          prompt: "Based on these images of yard sale items, write a brief, appealing description (2-3 sentences) of what's being sold. Focus on the main items visible and make it sound inviting to potential buyers.",
          file_urls: uploadedUrls
        });
        toast.dismiss(toastId);
        setAiDescription(generatedDescription);
        setEditableDescription(generatedDescription);
        toast.success('AI generated a description!');
      } catch (error) {
        toast.dismiss(toastId);
        toast.error(`AI Error: ${error.message || 'Could not generate description'}`);
      }
    }

    setIsUploading(false);
  };

  const handleCameraCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const photoLimit = user?.subscription_active ? 10 : 3;
    if (photos.length >= photoLimit) {
      toast.error(user?.subscription_active ? 'Maximum 10 photos allowed' : 'Maximum 3 photos for free users. Upgrade to Premium for up to 10 photos.');
      return;
    }

    setIsUploading(true);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setPhotos((prev) => [...prev, file_url]);

      // Generate AI description from photo
      const toastId = toast.loading('Generating description from photo...');
      try {
        const generatedDescription = await base44.integrations.Core.InvokeLLM({
          prompt: "Based on this image of yard sale items, write a brief, appealing description (2-3 sentences) of what's being sold. Focus on the main items visible and make it sound inviting to potential buyers.",
          file_urls: [file_url]
        });
        toast.dismiss(toastId);
        setAiDescription(generatedDescription);
        setEditableDescription(generatedDescription);
        toast.success('AI generated a description!');
      } catch (error) {
        toast.dismiss(toastId);
        toast.error(`AI Error: ${error.message || 'Could not generate description'}`);
      }
    } catch (error) {
      toast.error('Failed to upload photo');
    }

    setIsUploading(false);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = async (priceId, listingType) => {
    setIsCheckingPayment(true);
    base44.analytics.track({
      eventName: 'checkout_initiated',
      properties: { listing_type: listingType }
    });
    try {
      // Check if running in iframe
      if (window.self !== window.top) {
        toast.error('Checkout only works from the published app. Please open in a new tab.');
        setIsCheckingPayment(false);
        return;
      }

      const response = await base44.functions.invoke('createCheckout', { priceId, listingType });

      const checkoutUrl = response?.data?.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.error('Failed to create checkout session');
        setIsCheckingPayment(false);
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to create checkout session');
      setIsCheckingPayment(false);
    }
  };

  const handleSubmit = () => {
    base44.analytics.track({
      eventName: isEditMode ? 'sale_updated' : 'sale_created',
      properties: {
        category: formData.category,
        has_photos: photos.length > 0,
        photo_count: photos.length
      }
    });
    createMutation.mutate(formData);
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = async (currentFormData = formData) => {
    const { address, city, state, zip_code } = currentFormData;

    // Skip if not enough info
    if (!address) {
      setAddressValidation({ status: 'idle', message: '' });
      return;
    }

    setIsValidatingAddress(true);
    setAddressValidation({ status: 'checking', message: 'Checking address...' });

    try {
      // Try multiple query formats to increase success rate
      const queries = [
        `${address}, ${city}, ${state} ${zip_code}`,
        `${address}, ${zip_code}`,
        `${address}, ${city}, ${state}`,
        `${city}, ${state} ${zip_code}`,
        `${city}, ${state}`,
        `${address}`
      ].filter(q => q.trim());

      let geoData = [];
      for (const query of queries) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
            { headers: { 'User-Agent': 'Stooplify/1.0' } }
          );
          const data = await response.json();
          if (data.length > 0) {
            geoData = data;
            break;
          }
        } catch (err) {
          // Continue to next query on error
          continue;
        }
      }

      if (geoData.length > 0) {
        setAddressValidation({
          status: 'valid',
          message: `✓ Address found: ${geoData[0].display_name}`
        });
      } else {
        setAddressValidation({
          status: 'invalid',
          message: '⚠️ Address not found - try entering just the street address or city/state'
        });
      }
    } catch (error) {
      setAddressValidation({
        status: 'error',
        message: '⚠️ Could not verify address - you can still continue'
      });
    } finally {
      setIsValidatingAddress(false);
    }
  };

  const isStep1Valid = formData.title && formData.date && formData.categories?.length > 0;
  const isStep2Valid = formData.general_location && formData.address && formData.city && formData.state;

  if (isLoadingSale) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF6F61] animate-spin" />
      </div>);

  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center">

          <div className="w-20 h-20 bg-[#FF6F61]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10 text-[#FF6F61]" />
          </div>
          <h2
            className="text-2xl font-bold text-[#2E3A59] mb-3"
            style={{ fontFamily: 'Poppins, sans-serif' }}>

            {t('signInToListYourSale')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('createAccountToList')}
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => base44.auth.redirectToLogin()}
            className="w-full py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg"
            style={{ fontFamily: 'Poppins, sans-serif' }}>

            {t('signInOrCreateAccount')}
          </motion.button>
        </motion.div>
      </div>);

  }

  return (
    <div className="bg-[#F9F9F9] py-8 min-h-screen dark:bg-gray-900">
      <SEO 
        title={isEditMode ? "Edit Your Yard Sale Listing | Stooplify" : "List Your Yard Sale - Free First Listing | Stooplify"}
        description={isEditMode ? "Update your yard sale details, photos, and information" : "List your yard sale for free! Reach thousands of local buyers. Post garage sales, estate sales, or multi-family sales. Upload photos, set your date and location, and start selling today."}
        keywords="list yard sale, post garage sale, create sale listing, advertise yard sale, free yard sale posting, sell items locally"
      />
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Button */}
        <Link to={createPageUrl('Home')}>
            <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#FF6F61] transition-colors mb-6">

              <ArrowLeft className="w-5 h-5" />
              {t('back')}
            </motion.button>
          </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">

          <h1
            className="text-3xl font-bold text-[#2E3A59] dark:text-white mb-2"
            style={{ fontFamily: 'Poppins, sans-serif' }}>

            {isEditMode ? t('editYourYardSale') : t('addYourYardSale')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{isEditMode ? t('updateYourSaleDetails') : t('listYourSaleInJustSteps')}</p>
        </motion.div>

        {/* Progress Steps */}
        {step < 4 &&
        <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) =>
          <div key={s} className="flex items-center">
                <motion.div
              animate={{
                scale: step === s ? 1.1 : 1,
                backgroundColor: step >= s ? '#FF6F61' : '#e5e7eb'
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{ color: step >= s ? 'white' : '#9ca3af' }}>

                  {step > s ? <Check className="w-4 h-4" /> : s}
                </motion.div>
                {s < 3 &&
            <div className={`w-12 h-1 mx-2 rounded-full ${step > s ? 'bg-[#FF6F61]' : 'bg-gray-200'}`} />
            }
              </div>
          )}
          </div>
        }

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {step === 1 &&
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">

              <h2
              className="text-xl font-bold text-[#2E3A59] mb-6"
              style={{ fontFamily: 'Poppins, sans-serif' }}>

                {t('saleDetails')}
              </h2>

              <div className="space-y-5">
                <div>
                  <Label className="text-[#2E3A59] font-medium mb-2 block">{t('title')} *</Label>
                  <Input
                  placeholder={t('titlePlaceholder')}
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] py-6 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />

                </div>

                <div>
                  <Label className="text-[#2E3A59] font-medium mb-2 block">{t('date')} *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                    {[0, 1, 2, 7, 14].map((daysFromNow) => {
                    const date = new Date();
                    date.setDate(date.getDate() + daysFromNow);
                    const dateStr = date.toISOString().split('T')[0];
                    const dayName = daysFromNow === 0 ? 'Today' :
                    daysFromNow === 1 ? 'Tomorrow' :
                    date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                    return (
                      <button
                        key={daysFromNow}
                        type="button"
                        onClick={() => updateField('date', dateStr)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.date === dateStr ?
                        'bg-[#FF6F61] text-white' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`
                        }>

                          {dayName}
                        </button>);

                  })}
                  </div>
                  <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] py-6 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:[color-scheme:dark]" />

                  <p className="text-xs text-gray-500 mt-1">Or pick a custom date above</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-[#2E3A59] font-medium mb-2 block">Categories * (Select all that apply)</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {getCategoryLabels().map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <div
                          key={cat.value}
                          onClick={() => {
                            const current = formData.categories || [];
                            const newCategories = current.includes(cat.value) ?
                            current.filter((c) => c !== cat.value) :
                            [...current, cat.value];
                            updateField('categories', newCategories.length > 0 ? newCategories : ['general']);
                          }}
                          className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                          (formData.categories || []).includes(cat.value) ?
                          'bg-[#FF6F61] border-[#FF6F61] text-white' :
                          'bg-white border-gray-200 text-gray-700 hover:border-[#FF6F61]'}`
                          }>

                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{cat.label}</span>
                            {(formData.categories || []).includes(cat.value) &&
                          <Check className="w-4 h-4" />
                          }
                          </div>);

                    })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#2E3A59] font-medium mb-2 block">{t('startTime')}</Label>
                    <Input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => updateField('start_time', e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] py-6 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:[color-scheme:dark]" />

                  </div>
                  <div>
                    <Label className="text-[#2E3A59] font-medium mb-2 block">{t('endTime')}</Label>
                    <Input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => updateField('end_time', e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] py-6 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:[color-scheme:dark]" />

                  </div>
                </div>

                <div>
                  <Label className="text-[#2E3A59] font-medium mb-2 block">{t('description')}</Label>
                  <Textarea
                  placeholder={t('descriptionPlaceholder')}
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] min-h-[120px] text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />

                  <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                    💡 Tip: Leave blank and upload photos in Step 3 - our AI will generate a description for you!
                  </p>
                </div>

                {/* Payment Methods */}
                <div>
                  <Label className="text-[#2E3A59] font-medium mb-3 block">Payment Methods Accepted</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center justify-center w-5 h-5 rounded border-2 transition-all" style={{
                      borderColor: formData.payment_cash ? '#10b981' : '#d1d5db',
                      backgroundColor: formData.payment_cash ? '#10b981' : 'transparent'
                    }}>
                        {formData.payment_cash && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <Label
                      htmlFor="payment_cash"
                      className="flex items-center gap-2 cursor-pointer flex-1"
                      onClick={() => updateField('payment_cash', !formData.payment_cash)}>

                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span>Cash</span>
                      </Label>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center justify-center w-5 h-5 rounded border-2 transition-all" style={{
                      borderColor: formData.payment_card ? '#3b82f6' : '#d1d5db',
                      backgroundColor: formData.payment_card ? '#3b82f6' : 'transparent'
                    }}>
                        {formData.payment_card && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <Label
                      htmlFor="payment_card"
                      className="flex items-center gap-2 cursor-pointer flex-1"
                      onClick={() => updateField('payment_card', !formData.payment_card)}>

                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span>Credit/Debit Cards</span>
                      </Label>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center justify-center w-5 h-5 rounded border-2 transition-all" style={{
                      borderColor: formData.payment_digital ? '#a855f7' : '#d1d5db',
                      backgroundColor: formData.payment_digital ? '#a855f7' : 'transparent'
                    }}>
                        {formData.payment_digital && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <Label
                      htmlFor="payment_digital"
                      className="flex items-center gap-2 cursor-pointer flex-1"
                      onClick={() => updateField('payment_digital', !formData.payment_digital)}>

                        <Smartphone className="w-4 h-4 text-purple-600" />
                        <span>Digital (Venmo, PayPal, etc.)</span>
                      </Label>
                    </div>
                    {formData.payment_cash && (formData.payment_card || formData.payment_digital) &&
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                        <div className="flex items-center justify-center w-5 h-5 rounded border-2 transition-all" style={{
                      borderColor: formData.cash_preferred ? '#f59e0b' : '#d1d5db',
                      backgroundColor: formData.cash_preferred ? '#f59e0b' : 'transparent'
                    }}>
                          {formData.cash_preferred && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <Label
                      htmlFor="cash_preferred"
                      className="cursor-pointer flex-1 text-sm"
                      onClick={() => updateField('cash_preferred', !formData.cash_preferred)}>

                          <span className="font-medium">Cash Preferred</span>
                          <span className="text-gray-600 dark:text-gray-400 block">Other methods accepted but cash is easier</span>
                        </Label>
                      </div>
                  }
                  </div>
                </div>
              </div>

              <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!isStep1Valid}
              onClick={() => {
                setStep(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full mt-6 py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Poppins, sans-serif' }}>

                {t('continue')}
              </motion.button>
            </motion.div>
          }

          {/* Step 2: Location */}
          {step === 2 &&
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">

              <h2
              className="text-xl font-bold text-[#2E3A59] mb-6"
              style={{ fontFamily: 'Poppins, sans-serif' }}>

                {t('location')}
              </h2>

              <div className="space-y-5">
                <div>
                  <Label className="text-[#2E3A59] font-medium mb-2 flex items-center gap-2">
                    {t('generalLocationPublic')} *
                    <span className="text-xs text-gray-500 font-normal">{t('generalLocationHint')}</span>
                  </Label>
                  <Input
                  placeholder={t('generalLocationPlaceholder')}
                  value={formData.general_location}
                  onChange={(e) => updateField('general_location', e.target.value)}
                  className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] py-6 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />

                  <p className="text-xs text-gray-500 mt-1">
                    {t('approximateLocationPrivacy')}
                  </p>
                </div>

                <div>
                  <Label className="text-[#2E3A59] font-medium mb-2 flex items-center gap-2">
                    {t('exactStreetAddressPrivate')} *
                    <span className="text-xs text-green-600 font-normal">🔒 {t('protected')}</span>
                  </Label>
                  <div className="relative">
                    <Input
                    placeholder={t('exactAddressPlaceholder')}
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    className={`rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] py-6 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    addressValidation.status === 'valid' ? 'border-green-500 dark:border-green-500' :
                    addressValidation.status === 'invalid' ? 'border-red-500 dark:border-red-500' : ''}`
                    } />

                    {isValidatingAddress &&
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                  }
                  </div>
                  {addressValidation.message &&
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-xs mt-1 ${
                  addressValidation.status === 'valid' ? 'text-green-600' :
                  addressValidation.status === 'invalid' ? 'text-red-600' :
                  'text-gray-500'}`
                  }>

                      {addressValidation.message}
                    </motion.p>
                }
                  <p className="text-xs text-gray-500 mt-1">
                    {t('exactAddressUnlocksHint')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#2E3A59] font-medium mb-2 block">{t('city')} *</Label>
                    <Input
                    placeholder={t('cityPlaceholder')}
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] py-6 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />

                  </div>
                  <div>
                    <Label className="text-[#2E3A59] font-medium mb-2 block">{t('state')} *</Label>
                    <DrawerSelect
                      value={formData.state}
                      onValueChange={(value) => updateField('state', value)}
                      options={[
                        { value: 'AL', label: 'Alabama' },
                        { value: 'AK', label: 'Alaska' },
                        { value: 'AZ', label: 'Arizona' },
                        { value: 'AR', label: 'Arkansas' },
                        { value: 'CA', label: 'California' },
                        { value: 'CO', label: 'Colorado' },
                        { value: 'CT', label: 'Connecticut' },
                        { value: 'DE', label: 'Delaware' },
                        { value: 'FL', label: 'Florida' },
                        { value: 'GA', label: 'Georgia' },
                        { value: 'HI', label: 'Hawaii' },
                        { value: 'ID', label: 'Idaho' },
                        { value: 'IL', label: 'Illinois' },
                        { value: 'IN', label: 'Indiana' },
                        { value: 'IA', label: 'Iowa' },
                        { value: 'KS', label: 'Kansas' },
                        { value: 'KY', label: 'Kentucky' },
                        { value: 'LA', label: 'Louisiana' },
                        { value: 'ME', label: 'Maine' },
                        { value: 'MD', label: 'Maryland' },
                        { value: 'MA', label: 'Massachusetts' },
                        { value: 'MI', label: 'Michigan' },
                        { value: 'MN', label: 'Minnesota' },
                        { value: 'MS', label: 'Mississippi' },
                        { value: 'MO', label: 'Missouri' },
                        { value: 'MT', label: 'Montana' },
                        { value: 'NE', label: 'Nebraska' },
                        { value: 'NV', label: 'Nevada' },
                        { value: 'NH', label: 'New Hampshire' },
                        { value: 'NJ', label: 'New Jersey' },
                        { value: 'NM', label: 'New Mexico' },
                        { value: 'NY', label: 'New York' },
                        { value: 'NC', label: 'North Carolina' },
                        { value: 'ND', label: 'North Dakota' },
                        { value: 'OH', label: 'Ohio' },
                        { value: 'OK', label: 'Oklahoma' },
                        { value: 'OR', label: 'Oregon' },
                        { value: 'PA', label: 'Pennsylvania' },
                        { value: 'RI', label: 'Rhode Island' },
                        { value: 'SC', label: 'South Carolina' },
                        { value: 'SD', label: 'South Dakota' },
                        { value: 'TN', label: 'Tennessee' },
                        { value: 'TX', label: 'Texas' },
                        { value: 'UT', label: 'Utah' },
                        { value: 'VT', label: 'Vermont' },
                        { value: 'VA', label: 'Virginia' },
                        { value: 'WA', label: 'Washington' },
                        { value: 'WV', label: 'West Virginia' },
                        { value: 'WI', label: 'Wisconsin' },
                        { value: 'WY', label: 'Wyoming' }
                      ]}
                      placeholder={t('statePlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-[#2E3A59] font-medium mb-2 block">{t('zipCode')} *</Label>
                  <Input
                  placeholder={t('zipCodePlaceholder')}
                  value={formData.zip_code}
                  onChange={(e) => updateField('zip_code', e.target.value)}
                  className="rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61] py-6 max-w-[200px] text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />

                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 py-6 rounded-xl">

                  {t('back')}
                </Button>
                <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!isStep2Valid || isValidatingAddress}
                onClick={async () => {
                  await validateAddress(formData);
                  setStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {isValidatingAddress ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking...</> : t('continue')}
                </motion.button>
              </div>
            </motion.div>
          }

          {/* Step 3: Photos or Payment */}
          {step === 3 && needsPayment &&
          <motion.div
            key="step3-payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">

              <h2
              className="text-xl font-bold text-[#2E3A59] mb-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}>

                {t('paymentRequired')}
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                {t('firstListingFree')}
              </p>

              <div className="space-y-4 mb-6">
                {/* Single Listing */}
                <motion.button
                whileHover={{ scale: isCheckingPayment ? 1 : 1.02 }}
                className={`w-full border-2 border-gray-200 rounded-2xl p-6 text-left hover:border-[#FF6F61] transition-all ${
                isCheckingPayment ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`
                }
                onClick={() => !isCheckingPayment && handleCheckout(SINGLE_LISTING_PRICE_ID, 'single')}
                disabled={isCheckingPayment}>

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[#2E3A59]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {t('singleListing')}
                    </h3>
                    <span className="text-2xl font-bold text-[#FF6F61]">$4</span>
                  </div>
                  <p className="text-gray-600 text-sm">{t('payOnceForThisListing')}</p>
                </motion.button>

                {/* Unlimited Subscription */}
                <motion.button
                whileHover={{ scale: isCheckingPayment ? 1 : 1.02 }}
                className={`w-full border-2 border-gray-200 bg-[#FF6F61]/5 rounded-2xl p-6 text-left hover:border-[#FF6F61] transition-all relative overflow-hidden ${
                isCheckingPayment ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`
                }
                onClick={() => !isCheckingPayment && handleCheckout(SUBSCRIPTION_PRICE_ID, 'subscription')}
                disabled={isCheckingPayment}>

                  <div className="absolute top-2 right-2 bg-[#F5A623] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {t('bestValue')}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[#2E3A59]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {t('unlimitedListings')}
                    </h3>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[#FF6F61]">$9</span>
                      <span className="text-gray-600 text-sm ml-1">/month</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{t('postAsManySalesAsYouWant')}</p>
                </motion.button>
              </div>

              {isCheckingPayment &&
            <div className="flex items-center justify-center gap-2 text-[#FF6F61] mb-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-medium">{t('redirectingToCheckout')}</span>
                </div>
            }

              <div className="flex gap-4">
                <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1 py-6 rounded-xl"
                disabled={isCheckingPayment}>

                  {t('back')}
                </Button>
              </div>
            </motion.div>
          }

          {/* Step 3: Photos */}
          {step === 3 && !needsPayment &&
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">

              <h2
              className="text-xl font-bold text-[#2E3A59] mb-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}>

                {t('addPhotosOptional')}
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                {t('photosHelpAttractBuyers')}
              </p>

              {/* Photo Upload Area */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">
                    {photos.length} / {user?.subscription_active ? '10' : '3'} {t('photos')}
                  </p>
                  {!user?.subscription_active && photos.length >= 3 &&
                <p className="text-xs text-[#FF6F61]">
                      {t('upgradeForMorePhotos')}
                    </p>
                }
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-[#FF6F61] transition-colors">
                      {isUploading ?
                    <Loader2 className="w-8 h-8 text-[#FF6F61] mx-auto animate-spin" /> :

                    <>
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 font-medium text-sm">{t('uploadPhotos')}</p>
                          <p className="text-gray-400 text-xs mt-1">{t('fromGallery')}</p>
                        </>
                    }
                    </div>
                    <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={isUploading} />

                  </label>

                  <label className="block">
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-[#14B8FF] transition-colors">
                      {isUploading ?
                    <Loader2 className="w-8 h-8 text-[#14B8FF] mx-auto animate-spin" /> :

                    <>
                          <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 font-medium text-sm">{t('takePhoto')}</p>
                          <p className="text-gray-400 text-xs mt-1">{t('useCamera')}</p>
                        </>
                    }
                    </div>
                    <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCameraCapture}
                    className="hidden"
                    disabled={isUploading} />

                  </label>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  📸 {t('aiWillGenerateDescription')}
                </p>
              </div>

              {/* AI Description Preview - Always Visible */}
              <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#2E3A59] mb-2">{t('aiGeneratedDescription')}</h4>
                    <Textarea
                    value={editableDescription}
                    onChange={(e) => setEditableDescription(e.target.value)}
                    placeholder="Upload photos above and AI will generate a description..."
                    className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[100px] bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    disabled={!aiDescription} />

                  </div>
                </div>
                {aiDescription &&
              <div className="flex gap-2">
                    <Button
                  onClick={() => {
                    updateField('description', editableDescription);
                    toast.success('Description added!');
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600">

                      {t('useThisDescription')}
                    </Button>
                    <Button
                  variant="outline"
                  onClick={() => {
                    setEditableDescription('');
                    setAiDescription(null);
                    toast('Description cleared');
                  }}
                  className="flex-1">

                      Clear
                    </Button>
                  </div>
              }
              </motion.div>

              {/* Uploaded Photos */}
              {photos.length > 0 &&
            <div className="grid grid-cols-3 gap-3 mb-6">
                  {photos.map((photo, index) =>
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square rounded-xl overflow-hidden">

                      <img src={photo} alt="" className="w-full h-full object-cover" />
                      <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white">

                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </motion.div>
              )}
                </div>
            }

              {/* Notice */}
              <div className="bg-green-50 rounded-xl p-4 mb-6 flex items-start gap-3">
                <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  {t('listingWillGoLive')}
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1 py-6 rounded-xl">

                  {t('back')}
                </Button>
                <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={createMutation.isPending}
                onClick={handleSubmit}
                className="flex-1 py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}>

                  {createMutation.isPending ?
                <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('submitting')}...
                    </> :

                t('submitListing')
                }
                </motion.button>
              </div>
            </motion.div>
          }

          {/* Step 4: Success - This is just a brief loading state before redirect */}
          {step === 4 &&
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 shadow-lg text-center">

              <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">

                <Check className="w-10 h-10 text-green-500" />
              </motion.div>

              <h2
              className="text-2xl font-bold text-[#2E3A59] mb-3"
              style={{ fontFamily: 'Poppins, sans-serif' }}>

                {isEditMode ? t('saleUpdated') : t('saleIsLive')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('redirectingToSalePage')}
              </p>
              
              <Loader2 className="w-8 h-8 text-[#FF6F61] animate-spin mx-auto" />
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </div>);

}