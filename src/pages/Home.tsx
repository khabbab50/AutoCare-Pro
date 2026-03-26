import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  ShieldCheck, 
  Clock, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  Calendar,
  User,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Service, Testimonial, Post } from '../types';
import { Helmet } from 'react-helmet-async';

export const Home: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesSnap = await getDocs(query(collection(db, 'services'), limit(3)));
        setServices(servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));

        const testimonialsSnap = await getDocs(query(collection(db, 'testimonials'), limit(3)));
        setTestimonials(testimonialsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));

        const postsSnap = await getDocs(query(collection(db, 'posts'), orderBy('date', 'desc'), limit(3)));
        setPosts(postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    { title: 'Expert Mechanics', desc: 'Our team consists of certified professionals with years of experience.', icon: User },
    { title: 'Quality Parts', desc: 'We only use genuine or high-quality aftermarket parts for your vehicle.', icon: ShieldCheck },
    { title: 'Fast Service', desc: 'We value your time and strive to complete repairs as quickly as possible.', icon: Clock },
    { title: 'Modern Equipment', desc: 'We use the latest diagnostic tools to accurately identify issues.', icon: Wrench },
  ];

  return (
    <div className="space-y-24 pb-24">
      <Helmet>
        <title>AutoCare Pro | Professional Automotive Repair & Maintenance</title>
        <meta name="description" content="Expert car repair, engine diagnostics, brake service, and more. Book your appointment online today at AutoCare Pro." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=2000" 
            alt="Auto Repair Shop" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Expert Care for Your <span className="text-blue-500">Vehicle</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              From routine maintenance to complex engine repairs, our certified mechanics ensure your car stays on the road safely and efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/booking" 
                className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-500/20 flex items-center justify-center group"
              >
                Book Appointment
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/services" 
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full text-lg font-bold hover:bg-white/20 transition-all flex items-center justify-center"
              >
                View Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <feature.icon className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Our Expertise</h2>
              <h3 className="text-4xl font-bold text-gray-900 tracking-tight">Professional Services</h3>
            </div>
            <Link to="/services" className="hidden md:flex items-center text-blue-600 font-bold hover:text-blue-700 group">
              View All Services <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.length > 0 ? services.map((service, idx) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 flex flex-col"
              >
                <div className="h-56 relative overflow-hidden">
                  <img 
                    src={service.image || `https://images.unsplash.com/photo-1487754164641-a09f7c27b851?auto=format&fit=crop&q=80&w=800`} 
                    alt={service.title} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold text-blue-600">
                    {service.price || 'Call for Quote'}
                  </div>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <h4 className="text-2xl font-bold mb-4 text-gray-900">{service.title}</h4>
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{service.description}</p>
                  <Link 
                    to={`/services/${service.slug}`} 
                    className="mt-auto flex items-center text-blue-600 font-bold hover:text-blue-700"
                  >
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                No services added yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Testimonials</h2>
          <h3 className="text-4xl font-bold text-gray-900 tracking-tight">What Our Clients Say</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.length > 0 ? testimonials.map((testimonial, idx) => (
            <motion.div 
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 relative"
            >
              <div className="flex text-yellow-400 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-8 leading-relaxed text-lg">"{testimonial.content}"</p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                  {testimonial.author[0]}
                </div>
                <div>
                  <h5 className="font-bold text-gray-900">{testimonial.author}</h5>
                  <p className="text-sm text-gray-500">{testimonial.date}</p>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-3 text-center py-12 text-gray-500">
              No testimonials yet.
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-600/20">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">Ready to Get Your Vehicle Back in Top Shape?</h2>
            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              Don't wait for small issues to become big problems. Schedule your service online today and experience the AutoCare Pro difference.
            </p>
            <Link 
              to="/booking" 
              className="bg-white text-blue-600 px-10 py-5 rounded-full text-xl font-bold hover:bg-gray-100 transition-all shadow-xl inline-flex items-center"
            >
              Schedule Service Now
              <Calendar className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Latest News</h2>
            <h3 className="text-4xl font-bold text-gray-900 tracking-tight">Maintenance Tips & Blog</h3>
          </div>
          <Link to="/blog" className="hidden md:flex items-center text-blue-600 font-bold hover:text-blue-700 group">
            Read All Posts <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.length > 0 ? posts.map((post, idx) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <Link to={`/blog/${post.slug}`}>
                <div className="h-64 rounded-3xl overflow-hidden mb-6 shadow-sm group-hover:shadow-xl transition-all">
                  <img 
                    src={post.image || `https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800`} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-500 mb-3">
                  <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {post.date}</span>
                  <span className="flex items-center"><User className="h-4 w-4 mr-1" /> {post.author}</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h4>
              </Link>
            </motion.article>
          )) : (
            <div className="col-span-3 text-center py-12 text-gray-500">
              No blog posts yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
