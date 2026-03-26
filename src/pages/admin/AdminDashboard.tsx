import React, { useEffect, useState } from 'react';
import { 
  CalendarCheck, 
  Wrench, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Users,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Booking, Service, Testimonial, Post } from '../../types';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    bookings: 0,
    services: 0,
    testimonials: 0,
    posts: 0,
    pendingBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookingsSnap, servicesSnap, testimonialsSnap, postsSnap, pendingSnap] = await Promise.all([
          getDocs(collection(db, 'bookings')),
          getDocs(collection(db, 'services')),
          getDocs(collection(db, 'testimonials')),
          getDocs(collection(db, 'posts')),
          getDocs(query(collection(db, 'bookings'), where('status', '==', 'pending')))
        ]);

        setStats({
          bookings: bookingsSnap.size,
          services: servicesSnap.size,
          testimonials: testimonialsSnap.size,
          posts: postsSnap.size,
          pendingBookings: pendingSnap.size
        });

        const recentSnap = await getDocs(query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(5)));
        setRecentBookings(recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Bookings', value: stats.bookings, icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Services Offered', value: stats.services, icon: Wrench, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Testimonials', value: stats.testimonials, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Blog Posts', value: stats.posts, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Helmet>
        <title>Admin Dashboard | AutoCare Pro</title>
      </Helmet>
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-2">Welcome back to your AutoCare Pro management panel.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-3">
          <Clock className="h-5 w-5 text-blue-600" />
          <span className="font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all"
          >
            <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center mb-6`}>
              <stat.icon className={`h-7 w-7 ${stat.color}`} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.name}</p>
            <h3 className="text-4xl font-extrabold text-gray-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-blue-600 font-bold hover:text-blue-700 flex items-center group">
              View All <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                    <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentBookings.length > 0 ? recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-gray-900">{booking.customerName}</div>
                        <div className="text-sm text-gray-500">{booking.email}</div>
                      </td>
                      <td className="px-8 py-6 text-gray-600 font-medium">{booking.date}</td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                          booking.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                          booking.status === 'confirmed' ? 'bg-blue-50 text-blue-600' :
                          booking.status === 'completed' ? 'bg-green-50 text-green-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <Link to="/admin/bookings" className="text-blue-600 font-bold hover:text-blue-700">Manage</Link>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-gray-500">No bookings found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Quick Actions</h2>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
            <Link to="/admin/services" className="w-full flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-all group">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:text-blue-600">
                  <Wrench className="h-5 w-5" />
                </div>
                <span className="font-bold text-gray-700">Add New Service</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link to="/admin/posts" className="w-full flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-all group">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="font-bold text-gray-700">Write Blog Post</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {stats.pendingBookings > 0 && (
            <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100">
              <div className="flex items-center space-x-3 text-orange-600 mb-4">
                <AlertCircle className="h-6 w-6" />
                <h3 className="font-bold text-lg">Action Required</h3>
              </div>
              <p className="text-orange-800 mb-6 leading-relaxed">
                You have <span className="font-bold">{stats.pendingBookings} pending booking requests</span> that need your attention.
              </p>
              <Link to="/admin/bookings" className="inline-flex items-center bg-orange-600 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">
                Review Requests <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
