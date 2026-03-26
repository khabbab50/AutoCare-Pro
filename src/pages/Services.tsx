import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  ArrowRight, 
  Search,
  CheckCircle2,
  Car,
  Settings,
  ShieldCheck,
  Zap,
  Thermometer,
  Disc
} from 'lucide-react';
import { motion } from 'motion/react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Service } from '../types';
import { Helmet } from 'react-helmet-async';

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const iconMap: { [key: string]: any } = {
    Wrench, Settings, ShieldCheck, Zap, Thermometer, Disc, Car
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Our Services | AutoCare Pro</title>
        <meta name="description" content="Explore our wide range of professional automotive services, from engine diagnostics to brake repair and routine maintenance." />
      </Helmet>

      {/* Header */}
      <div className="bg-gray-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://picsum.photos/seed/autocare-services-header/1920/1080" 
            alt="Mechanic working" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6"
          >
            Our Professional <span className="text-blue-500">Services</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Comprehensive maintenance and repair solutions for all vehicle makes and models. Quality you can trust, service you can depend on.
          </motion.p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for a service..." 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 px-4">
            <span className="font-bold text-gray-900">{filteredServices.length}</span> services found
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredServices.map((service, idx) => {
              const Icon = iconMap[service.icon] || Wrench;
              return (
                <motion.div 
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 flex flex-col group"
                >
                  <div className="h-64 relative overflow-hidden">
                    <img 
                      src={service.image || `https://picsum.photos/seed/autocare-service-card/800/600`} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                  <div className="p-10 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-8 line-clamp-3 leading-relaxed">{service.description}</p>
                    <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between items-center">
                      <span className="text-blue-600 font-bold text-lg">{service.price || 'Contact Us'}</span>
                      <Link 
                        to={`/services/${service.slug}`} 
                        className="flex items-center text-gray-900 font-bold hover:text-blue-600 transition-colors group/link"
                      >
                        Details <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm border border-gray-100">
            <Car className="h-16 w-16 text-gray-200 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500">Try adjusting your search terms or check back later.</p>
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">The AutoCare Difference</h2>
            <h3 className="text-4xl font-bold text-gray-900 tracking-tight">Why Choose Our Shop?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Certified Technicians', desc: 'Our team is ASE certified and undergoes regular training on the latest vehicle technologies.', icon: CheckCircle2 },
              { title: 'Transparent Pricing', desc: 'No hidden fees. We provide detailed estimates and explain every repair before we start.', icon: CheckCircle2 },
              { title: 'Warranty Guaranteed', desc: 'We stand behind our work with a comprehensive warranty on parts and labor.', icon: CheckCircle2 },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <item.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-bold mb-4 text-gray-900">{item.title}</h4>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
