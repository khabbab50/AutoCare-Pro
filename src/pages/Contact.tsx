import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to a backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      content: '(555) 123-4567',
      subContent: 'Mon-Fri, 8am-6pm',
      color: 'blue'
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: 'service@autocarepro.com',
      subContent: 'We reply within 24 hours',
      color: 'orange'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: '123 Mechanic Lane',
      subContent: 'Automotive City, AC 12345',
      color: 'red'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Mon-Fri: 8am - 6pm',
      subContent: 'Sat: 9am - 2pm, Sun: Closed',
      color: 'green'
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-24">
      <Helmet>
        <title>Contact Us | AutoCare Pro Automotive Services</title>
        <meta name="description" content="Get in touch with AutoCare Pro. Call us, visit our shop, or send us a message for any automotive repair or maintenance inquiries." />
      </Helmet>

      {/* Hero Header */}
      <div className="bg-gray-900 py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=2000" 
            alt="Contact us" 
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
            Get in <span className="text-blue-500">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Have a question about your vehicle or our services? We're here to help. Reach out to us through any of the channels below.
          </motion.p>
        </div>
      </div>

      {/* Contact Info Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 text-center group hover:bg-blue-600 transition-all duration-500"
            >
              <div className={`w-14 h-14 rounded-2xl bg-${info.color}-50 flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-colors`}>
                <info.icon className={`h-7 w-7 text-${info.color}-600 group-hover:text-white transition-colors`} />
              </div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 group-hover:text-blue-100 transition-colors">{info.title}</h3>
              <p className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors mb-1">{info.content}</p>
              <p className="text-sm text-gray-500 group-hover:text-blue-200 transition-colors">{info.subContent}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Form & Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Send a Message</h2>
            </div>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 p-10 rounded-[2.5rem] text-center border border-green-100"
              >
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-green-900 mb-4">Message Sent!</h3>
                <p className="text-green-700 leading-relaxed">
                  Thank you for reaching out. Our team will get back to you as soon as possible.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-green-600 font-bold hover:text-green-700 underline underline-offset-8"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com" 
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="(555) 000-0000" 
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Subject</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Service Inquiry" 
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Your Message</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="How can we help you?" 
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center group"
                >
                  Send Message <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            )}
          </motion.div>

          {/* Map & Social */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <div className="bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl flex-grow mb-12 relative min-h-[400px]">
              {/* Placeholder for Google Map */}
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="text-center p-10">
                  <MapPin className="h-16 w-16 text-blue-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">Our Location</h3>
                  <p className="text-gray-400 max-w-xs mx-auto leading-relaxed">
                    123 Mechanic Lane, Automotive City, AC 12345
                  </p>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center text-blue-400 font-bold hover:text-blue-300 transition-colors group"
                  >
                    Get Directions <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Follow Our Journey</h3>
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, label: 'Facebook', color: 'blue' },
                  { icon: Twitter, label: 'Twitter', color: 'blue' },
                  { icon: Instagram, label: 'Instagram', color: 'pink' },
                  { icon: Linkedin, label: 'LinkedIn', color: 'blue' }
                ].map((social, i) => (
                  <button 
                    key={i}
                    className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-gray-100"
                    aria-label={social.label}
                  >
                    <social.icon className="h-6 w-6" />
                  </button>
                ))}
              </div>
              <p className="mt-8 text-gray-500 leading-relaxed">
                Follow us for daily maintenance tips, special offers, and a behind-the-scenes look at our workshop.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
