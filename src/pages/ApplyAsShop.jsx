import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  Store, Upload, Check, Loader2, ArrowLeft, Star, TrendingUp, Users, Zap
} from 'lucide-react';
import SEO from '../components/SEO';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function ApplyAsShop() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    shop_name: '',
    business_type: 'thrift_store',
    description: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
    website: '',
    hours: '',
    contact_name: '',
    contact_email: '',
    years_in_business: '',
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        setIsAuthenticated(isAuth);
        if (isAuth) {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
          setFormData(prev => ({
            ...prev,
            contact_email: currentUser.email,
            contact_name: currentUser.full_name || ''
          }));
        }
      } catch (e) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.ShopApplication.create({
        ...data,
        photos: photos,
        status: 'pending',
        is_featured: false,
        subscription_status: 'none',
        years_in_business: parseInt(data.years_in_business) || 0
      });
    },
    onSuccess: () => {
      toast.success('Application submitted! We\'ll review it within 24 hours.');
      setSubmitted(true);
    },
    onError: () => {
      toast.error('Failed to submit application. Please try again.');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const benefits = [
    { icon: Star, text: 'Featured placement on homepage' },
    { icon: TrendingUp, text: 'Unlimited weekly postings' },
    { icon: Users, text: 'Reach thousands of local shoppers' },
    { icon: Zap, text: 'Priority support & analytics' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-[#FF6F61]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="w-10 h-10 text-[#FF6F61]" />
          </div>
          <h2 
            className="text-2xl font-bold text-[#2E3A59] mb-3"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Sign In to Apply
          </h2>
          <p className="text-gray-600 mb-6">
            Create an account to apply as a featured shop on Stooplify.
          </p>
          <Button
            onClick={() => base44.auth.redirectToLogin()}
            className="w-full py-4 bg-[#FF6F61] hover:bg-[#e55a4d] rounded-xl font-semibold"
          >
            Sign In or Create Account
          </Button>
        </motion.div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center"
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
            Application Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            We'll review your application within 24 hours and get back to you via email.
          </p>
          
          <Link to={createPageUrl('Home')}>
            <Button className="w-full py-4 bg-[#FF6F61] hover:bg-[#e55a4d] rounded-xl">
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-8">
      <SEO
        title="Apply as a Featured Shop on Stooplify | NYC Thrift Stores & Consignment"
        description="Apply to list your thrift store, consignment shop, antique shop, or flea market as a featured shop on Stooplify. Reach thousands of local shoppers in NYC and beyond."
        keywords="apply as featured shop stooplify, thrift store listing NYC, consignment shop advertising, antique shop listing, flea market listing, shop on stooplify"
        url="https://stooplify.com/ApplyAsShop"
      />
      <div className="max-w-4xl mx-auto px-4">
        <Link to={createPageUrl('Pricing')}>
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-gray-600 hover:text-[#FF6F61] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Pricing
          </motion.button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF6F61] to-[#F5A623] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 
            className="text-3xl font-bold text-[#2E3A59] mb-2"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Apply as a Featured Shop
          </h1>
          <p className="text-gray-600 mb-6">
            Get your shop featured on Stooplify and reach thousands of local treasure hunters
          </p>
          
          {/* Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <benefit.icon className="w-6 h-6 text-[#FF6F61] mx-auto mb-2" />
                <p className="text-xs text-gray-600">{benefit.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shop Information */}
            <div>
              <h3 className="text-lg font-bold text-[#2E3A59] mb-4">Shop Information</h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Shop Name *</Label>
                    <Input
                      required
                      value={formData.shop_name}
                      onChange={(e) => updateField('shop_name', e.target.value)}
                      placeholder="Main Street Thrift"
                      className="rounded-xl mt-1"
                    />
                  </div>
                  <div>
                    <Label>Business Type *</Label>
                    <Select 
                      value={formData.business_type} 
                      onValueChange={(value) => updateField('business_type', value)}
                    >
                      <SelectTrigger className="rounded-xl mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="thrift_store">Thrift Store</SelectItem>
                        <SelectItem value="consignment">Consignment Shop</SelectItem>
                        <SelectItem value="antique_shop">Antique Shop</SelectItem>
                        <SelectItem value="flea_market">Flea Market</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Description *</Label>
                  <Textarea
                    required
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Tell us about your shop, what you sell, and what makes you unique..."
                    className="rounded-xl mt-1 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>Years in Business *</Label>
                  <Input
                    required
                    type="number"
                    min="1"
                    value={formData.years_in_business}
                    onChange={(e) => updateField('years_in_business', e.target.value)}
                    placeholder="5"
                    className="rounded-xl mt-1 max-w-[200px]"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-bold text-[#2E3A59] mb-4">Location</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Street Address *</Label>
                  <Input
                    required
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="123 Main Street"
                    className="rounded-xl mt-1"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>City *</Label>
                    <Input
                      required
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="Brooklyn"
                      className="rounded-xl mt-1"
                    />
                  </div>
                  <div>
                    <Label>State *</Label>
                    <Input
                      required
                      value={formData.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      placeholder="NY"
                      className="rounded-xl mt-1"
                    />
                  </div>
                  <div>
                    <Label>ZIP Code</Label>
                    <Input
                      value={formData.zip_code}
                      onChange={(e) => updateField('zip_code', e.target.value)}
                      placeholder="11201"
                      className="rounded-xl mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Hours */}
            <div>
              <h3 className="text-lg font-bold text-[#2E3A59] mb-4">Contact & Hours</h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Contact Name *</Label>
                    <Input
                      required
                      value={formData.contact_name}
                      onChange={(e) => updateField('contact_name', e.target.value)}
                      placeholder="John Smith"
                      className="rounded-xl mt-1"
                    />
                  </div>
                  <div>
                    <Label>Contact Email *</Label>
                    <Input
                      required
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => updateField('contact_email', e.target.value)}
                      placeholder="john@example.com"
                      className="rounded-xl mt-1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className="rounded-xl mt-1"
                    />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input
                      value={formData.website}
                      onChange={(e) => updateField('website', e.target.value)}
                      placeholder="https://yourshop.com"
                      className="rounded-xl mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Operating Hours</Label>
                  <Input
                    value={formData.hours}
                    onChange={(e) => updateField('hours', e.target.value)}
                    placeholder="Mon-Fri: 10am-6pm, Sat-Sun: 11am-5pm"
                    className="rounded-xl mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Photos */}
            <div>
              <h3 className="text-lg font-bold text-[#2E3A59] mb-4">Shop Photos</h3>
              
              <label className="block">
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-[#FF6F61] transition-colors">
                  {isUploading ? (
                    <Loader2 className="w-10 h-10 text-[#FF6F61] mx-auto animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">Click to upload photos</p>
                      <p className="text-gray-400 text-sm mt-1">Add photos of your shop exterior, interior, and products</p>
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

              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full py-6 bg-[#FF6F61] hover:bg-[#e55a4d] rounded-xl font-semibold text-lg"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}