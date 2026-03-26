import React from 'react';
import { 
  Award, 
  Users, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Wrench,
  ArrowRight,
  Target,
  Heart,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export const About: React.FC = () => {
  const stats = [
    { label: 'Years Experience', value: '15+', icon: Clock },
    { label: 'Happy Customers', value: '10k+', icon: Users },
    { label: 'Certified Techs', value: '25+', icon: Award },
    { label: 'Service Bays', value: '12', icon: Wrench },
  ];

  const values = [
    {
      title: 'Integrity First',
      description: 'We believe in honest assessments and transparent pricing. No hidden fees, no unnecessary repairs.',
      icon: ShieldCheck,
      color: 'blue'
    },
    {
      title: 'Quality Excellence',
      description: 'Our certified technicians use state-of-the-art diagnostic tools and premium parts for every job.',
      icon: Zap,
      color: 'orange'
    },
    {
      title: 'Customer Centric',
      description: 'Your safety and satisfaction are our top priorities. We treat every vehicle as if it were our own.',
      icon: Heart,
      color: 'red'
    },
    {
      title: 'Innovation Driven',
      description: 'We stay ahead of automotive technology to service modern hybrid and electric vehicles efficiently.',
      icon: Target,
      color: 'green'
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-24">
      <Helmet>
        <title>About Us | AutoCare Pro Automotive Services</title>
        <meta name="description" content="Learn about AutoCare Pro, our mission, values, and the expert team dedicated to keeping your vehicle safe and reliable." />
      </Helmet>

      {/* Hero Header */}
      <div className="bg-gray-900 py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://picsum.photos/seed/autocare-hero/1920/1080" 
            alt="Auto shop" 
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
            Driven by <span className="text-blue-500">Excellence</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Since 2011, AutoCare Pro has been the trusted name in automotive repair, combining traditional craftsmanship with modern technology.
          </motion.p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 text-center group hover:bg-blue-600 transition-all duration-500"
            >
              <stat.icon className="h-10 w-10 text-blue-600 mx-auto mb-4 group-hover:text-white transition-colors" />
              <div className="text-3xl font-bold text-gray-900 group-hover:text-white transition-colors mb-1">{stat.value}</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-100 transition-colors">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/autocare-story/1000/800" 
                alt="Our team" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600 rounded-[3rem] -z-10 hidden lg:block"></div>
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-gray-100 rounded-[3rem] -z-10 hidden lg:block"></div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.3em] mb-4">Our Journey</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">A Legacy of Trust and Reliability</h3>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                Founded by master mechanic John Anderson, AutoCare Pro started as a small two-bay garage with a simple mission: to provide dealership-quality service with the personal touch of a family-owned business.
              </p>
              <p>
                Over the past 15 years, we've grown into a state-of-the-art facility, but our core principles remain unchanged. We believe that every customer deserves an honest explanation, a fair price, and a vehicle that is safe for their family.
              </p>
              <p>
                Today, we are proud to be one of the highest-rated repair shops in the region, serving thousands of loyal customers who trust us with their most important assets.
              </p>
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-gray-50 px-6 py-3 rounded-full border border-gray-100">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-bold text-gray-900">ASE Certified</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-6 py-3 rounded-full border border-gray-100">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-bold text-gray-900">AAA Approved</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-6 py-3 rounded-full border border-gray-100">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-bold text-gray-900">NAPA AutoCare</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.3em] mb-4">Our Values</h2>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">What We Stand For</h3>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Our values guide every decision we make and every repair we perform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-${value.color}-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <value.icon className={`h-8 w-8 text-${value.color}-600`} />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">{value.title}</h4>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.3em] mb-4">Expert Team</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">Meet the Masters Behind the Wrench</h3>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Our team consists of ASE-certified technicians who undergo continuous training to stay current with the latest automotive advancements.
            </p>
            <div className="space-y-6">
              {[
                'Continuous Technical Training',
                'Advanced Diagnostic Expertise',
                'Specialized Hybrid & EV Knowledge',
                'Customer Service Excellence'
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-12">
              <Link 
                to="/contact" 
                className="inline-flex items-center bg-gray-900 text-white px-10 py-5 rounded-full font-bold hover:bg-gray-800 transition-all shadow-xl group"
              >
                Join Our Team <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              'https://picsum.photos/seed/mechanic1/600/800',
              'https://picsum.photos/seed/mechanic2/600/800',
              'https://picsum.photos/seed/mechanic3/600/800',
              'https://picsum.photos/seed/mechanic4/600/800'
            ].map((img, i) => (
              <div key={i} className={`rounded-[2.5rem] overflow-hidden shadow-lg ${i % 2 === 1 ? 'mt-12' : ''}`}>
                <img 
                  src={img} 
                  alt={`Team member ${i + 1}`} 
                  className="w-full h-full object-cover aspect-[3/4]"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">Ready to Experience the AutoCare Pro Difference?</h2>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              Join thousands of satisfied customers who trust us with their vehicle's safety and performance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                to="/booking" 
                className="bg-blue-600 text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
              >
                Book Your Appointment
              </Link>
              <Link 
                to="/contact" 
                className="bg-white/10 text-white border border-white/20 px-12 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
