import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Trash2, 
  CalendarCheck, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Filter,
  ChevronRight,
  User,
  Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { Booking, Service } from '../../types';

export const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const bookingsQ = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const bookingsSnap = await getDocs(bookingsQ);
      const bookingsData = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(bookingsData);

      const servicesSnap = await getDocs(collection(db, 'services'));
      const servicesMap: { [key: string]: string } = {};
      servicesSnap.docs.forEach(doc => {
        servicesMap[doc.id] = doc.data().title;
      });
      setServices(servicesMap);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: Booking['status']) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      if (selectedBooking?.id === id) {
        setSelectedBooking(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'bookings');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking request?')) {
      try {
        await deleteDoc(doc(db, 'bookings', id));
        setBookings(prev => prev.filter(b => b.id !== id));
        setSelectedBooking(null);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'bookings');
      }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10">
      <Helmet>
        <title>Manage Bookings | AutoCare Pro</title>
      </Helmet>
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Booking Requests</h1>
          <p className="text-gray-500 mt-2">Manage and respond to customer service appointments.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-3">
            <Filter className="h-5 w-5 text-blue-600" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none focus:ring-0 font-bold text-gray-900 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by customer name or email..." 
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-widest">Service</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelectedBooking(booking)}>
                  <td className="px-8 py-6">
                    <div className="font-bold text-gray-900">{booking.customerName}</div>
                    <div className="text-sm text-gray-500">{booking.email}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-medium text-gray-700">{services[booking.serviceId] || 'Unknown Service'}</div>
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
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-gray-500">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                    <CalendarCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                    <p className="text-sm text-gray-500">ID: {selectedBooking.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <div className="p-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <User className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Customer</p>
                        <p className="font-bold text-gray-900 text-lg">{selectedBooking.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Mail className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                        <p className="font-medium text-gray-700">{selectedBooking.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Phone className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                        <p className="font-medium text-gray-700">{selectedBooking.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <Wrench className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Service</p>
                        <p className="font-bold text-gray-900 text-lg">{services[selectedBooking.serviceId] || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Clock className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Requested Date</p>
                        <p className="font-bold text-gray-900 text-lg">{selectedBooking.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                        <span className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                          selectedBooking.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                          selectedBooking.status === 'confirmed' ? 'bg-blue-50 text-blue-600' :
                          selectedBooking.status === 'completed' ? 'bg-green-50 text-green-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {selectedBooking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedBooking.message && (
                  <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                    <div className="flex items-center space-x-2 text-gray-400 mb-4">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Customer Message</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed italic">"{selectedBooking.message}"</p>
                  </div>
                )}

                <div className="pt-8 border-t border-gray-100 flex flex-wrap gap-4">
                  <button 
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'confirmed')}
                    disabled={selectedBooking.status === 'confirmed'}
                    className="flex-grow bg-blue-600 text-white py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                  >
                    Confirm Booking
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'completed')}
                    disabled={selectedBooking.status === 'completed'}
                    className="flex-grow bg-green-600 text-white py-4 rounded-full font-bold hover:bg-green-700 transition-all shadow-xl shadow-green-600/20 disabled:opacity-50"
                  >
                    Mark Completed
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'cancelled')}
                    disabled={selectedBooking.status === 'cancelled'}
                    className="flex-grow bg-gray-100 text-gray-700 py-4 rounded-full font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedBooking.id)}
                    className="w-full bg-red-50 text-red-600 py-4 rounded-full font-bold hover:bg-red-100 transition-all"
                  >
                    Delete Request
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
