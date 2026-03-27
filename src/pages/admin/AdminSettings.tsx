import React, { useEffect, useState } from 'react';
import { 
  Settings, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Save, 
  CheckCircle2,
  Globe,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { Settings as SiteSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<SiteSettings>({
    siteName: 'AutoCare Pro',
    contactEmail: 'support@autocarepro.com',
    phone: '+1 (555) 123-4567',
    address: '123 Mechanic Lane, Auto City, AC 54321',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: ''
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'main'));
        if (settingsDoc.exists()) {
          setFormData(settingsDoc.data() as SiteSettings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      await setDoc(doc(db, 'settings', 'main'), formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/main');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Helmet>
        <title>Site Settings | AutoCare Pro</title>
      </Helmet>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Site Settings</h1>
          <p className="text-gray-500 mt-2">Configure your business information and social links.</p>
        </div>
        {success && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-auto bg-green-50 text-green-600 px-6 py-3 rounded-2xl border border-green-100 flex items-center font-bold justify-center md:justify-start"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" /> Settings Saved
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        {/* General Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
              <Globe className="h-6 w-6 mr-3 text-blue-600" /> Business Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Site Name</label>
                <input
                  required
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    required
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Physical Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    required
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
              <Settings className="h-6 w-6 mr-3 text-blue-600" /> Social Media Links
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center">
                  <Facebook className="h-4 w-4 mr-2 text-blue-600" /> Facebook URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks?.facebook || ''}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, facebook: e.target.value } })}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center">
                  <Twitter className="h-4 w-4 mr-2 text-blue-600" /> Twitter URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks?.twitter || ''}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center">
                  <Instagram className="h-4 w-4 mr-2 text-blue-600" /> Instagram URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks?.instagram || ''}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Sidebar */}
        <div className="space-y-8">
          <div className="bg-gray-900 p-8 md:p-10 rounded-3xl md:rounded-[3rem] text-white shadow-2xl shadow-gray-900/20 lg:sticky lg:top-28">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <ShieldCheck className="h-5 w-5 mr-3 text-blue-500" /> Publish Changes
            </h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Updating these settings will immediately change the information displayed across your entire website.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>Save Settings <Save className="ml-2 h-5 w-5" /></>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
