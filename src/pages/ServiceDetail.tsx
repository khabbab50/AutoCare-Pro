import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Wrench,
  ChevronRight,
  Star
} from 'lucide-react';
import { motion } from 'motion/react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Service } from '../types';
import { Helmet } from 'react-helmet-async';

export const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const q = query(collection(db, 'services'), where('slug', '==', slug), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setService({ id: doc.id, ...doc.data() } as Service);
        } else {
          navigate('/services');
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchService();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service) return null;

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <Helmet>
        <title>{service.title} | AutoCare Pro</title>
        <meta name="description" content={service.description.substring(0, 160)} />
      </Helmet>

      {/* Hero Header */}
      <div className="bg-gray-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src={service.image || "https://picsum.photos/seed/autocare-service-detail/1920/1080"} 
            alt={service.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/services" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 font-bold transition-colors group">
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Back to Services
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4"
          >
            {service.title}
          </motion.h1>
          <div className="flex items-center space-x-4 text-blue-400 font-bold text-xl">
            <span>{service.price || 'Call for Quote'}</span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center"><Clock className="h-5 w-5 mr-2" /> Same Day Available</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-10 md:p-16 rounded-[3rem] shadow-xl border border-gray-100"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Service Overview</h2>
              <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed space-y-6">
                {service.description.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                  <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                    <CheckCircle2 className="h-6 w-6 mr-2 text-blue-600" /> What's Included
                  </h3>
                  <ul className="space-y-3 text-blue-800">
                    <li className="flex items-start"><ChevronRight className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" /> Full diagnostic inspection</li>
                    <li className="flex items-start"><ChevronRight className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" /> Expert labor and quality parts</li>
                    <li className="flex items-start"><ChevronRight className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" /> 12-month / 12,000-mile warranty</li>
                    <li className="flex items-start"><ChevronRight className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" /> Complimentary multi-point check</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <ShieldCheck className="h-6 w-6 mr-2 text-blue-600" /> Why Choose Us
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start"><ChevronRight className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" /> ASE Certified Technicians</li>
                    <li className="flex items-start"><ChevronRight className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" /> State-of-the-art equipment</li>
                    <li className="flex items-start"><ChevronRight className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" /> Transparent, upfront pricing</li>
                    <li className="flex items-start"><ChevronRight className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" /> Family owned and operated</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* FAQ or Process Section */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: 'How long does this service typically take?', a: 'Most services are completed within 2-4 hours, though complex repairs may take longer. We will provide a specific estimate after the initial inspection.' },
                  { q: 'Do you offer a warranty on this service?', a: 'Yes, all our services come with a standard 12-month or 12,000-mile warranty on both parts and labor.' },
                  { q: 'Can I wait at the shop while you work?', a: 'Absolutely! We have a comfortable waiting area with free Wi-Fi, coffee, and refreshments.' },
                ].map((faq, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">{faq.q}</h4>
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Booking Card */}
            <div className="bg-blue-600 p-10 rounded-[3rem] shadow-2xl shadow-blue-600/20 text-white sticky top-28">
              <h3 className="text-2xl font-bold mb-6">Schedule This Service</h3>
              <p className="text-blue-100 mb-8 leading-relaxed">
                Ready to get started? Book your appointment online in less than 2 minutes.
              </p>
              <Link 
                to={`/booking?service=${service.id}`} 
                className="w-full bg-white text-blue-600 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center shadow-xl active:scale-95"
              >
                Book Now <Calendar className="ml-2 h-5 w-5" />
              </Link>
              <div className="mt-8 pt-8 border-t border-blue-500/30 space-y-4">
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-bold">4.9/5 Customer Rating</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Wrench className="h-5 w-5 text-blue-200" />
                  <span className="text-blue-100">Expert diagnostics included</span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Need Help?</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Have questions about this service? Speak with one of our experts.
              </p>
              <div className="space-y-4">
                <a href="tel:+15551234567" className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors group">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:text-blue-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Call Us</p>
                    <p className="font-bold text-gray-900">(555) 123-4567</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
