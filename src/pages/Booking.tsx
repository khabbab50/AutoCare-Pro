import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Wrench, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Service } from '../types';
import { Helmet } from 'react-helmet-async';

export const Booking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    serviceId: searchParams.get('service') || '',
    date: '',
    message: ''
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, 'services'), orderBy('title'));
        const querySnapshot = await getDocs(q);
        setServices(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const bookingData = {
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'bookings'), bookingData);
      setSubmitted(true);
      setTimeout(() => navigate('/'), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'bookings');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white shadow-2xl rounded-[3rem] p-12 text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Booking Received!</h1>
          <p className="text-gray-600 mb-10 leading-relaxed text-lg">
            Thank you for choosing AutoCare Pro. We've received your request and will contact you shortly to confirm your appointment.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl active:scale-95 flex items-center justify-center"
          >
            Back to Home <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <p className="mt-6 text-sm text-gray-400">Redirecting in a few seconds...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-24">
      <Helmet>
        <title>Book an Appointment | AutoCare Pro</title>
        <meta name="description" content="Schedule your automotive service online. Quick, easy, and reliable booking for all your car maintenance needs." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Info */}
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                Schedule Your <span className="text-blue-600">Service</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Book your appointment online today. Our expert team is ready to get your vehicle back on the road in top condition.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { title: 'Expert Diagnostics', desc: 'We use the latest tools to identify issues accurately.', icon: Wrench },
                { title: 'Quality Guaranteed', desc: 'All repairs come with our comprehensive warranty.', icon: ShieldCheck },
                { title: 'Fast Turnaround', desc: 'Most services completed the same day.', icon: Clock },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
                    <item.icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-600 p-10 rounded-[3rem] shadow-2xl shadow-blue-600/20 text-white">
              <h3 className="text-2xl font-bold mb-4">Need Immediate Help?</h3>
              <p className="text-blue-100 mb-8 leading-relaxed">
                For emergency repairs or same-day availability, it's best to call us directly.
              </p>
              <a href="tel:+15551234567" className="inline-flex items-center text-3xl font-bold hover:text-blue-200 transition-colors">
                <Phone className="mr-4 h-8 w-8" />
                (555) 123-4567
              </a>
            </div>
          </div>

          {/* Right Side: Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 md:p-16 rounded-[3rem] shadow-xl border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center">
                    <User className="h-4 w-4 mr-2 text-blue-600" /> Full Name
                  </label>
                  <input
                    required
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-blue-600" /> Email Address
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-blue-600" /> Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 000-0000"
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Service */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center">
                    <Wrench className="h-4 w-4 mr-2 text-blue-600" /> Service Type
                  </label>
                  <select
                    required
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                  >
                    <option value="">Select a service</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>{service.title}</option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" /> Preferred Date
                  </label>
                  <input
                    required
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-blue-600" /> Additional Details
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your vehicle or the issue you're experiencing..."
                    rows={4}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full bg-blue-600 text-white py-5 rounded-full font-bold text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>Confirm Booking <ArrowRight className="ml-2 h-6 w-6" /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
