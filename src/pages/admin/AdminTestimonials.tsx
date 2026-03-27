import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Star, 
  X, 
  MessageSquare, 
  User,
  Calendar,
  Quote
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { Testimonial } from '../../types';

export const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    author: '',
    content: '',
    rating: 5,
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const q = query(collection(db, 'testimonials'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      setTestimonials(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        author: testimonial.author,
        content: testimonial.content,
        rating: testimonial.rating,
        date: testimonial.date
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        author: '',
        content: '',
        rating: 5,
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingTestimonial) {
        await updateDoc(doc(db, 'testimonials', editingTestimonial.id), formData);
      } else {
        await addDoc(collection(db, 'testimonials'), formData);
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (error) {
      handleFirestoreError(error, editingTestimonial ? OperationType.UPDATE : OperationType.CREATE, 'testimonials');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteDoc(doc(db, 'testimonials', id));
        fetchTestimonials();
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'testimonials');
      }
    }
  };

  const filteredTestimonials = testimonials.filter(t => 
    t.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <Helmet>
        <title>Manage Testimonials | AutoCare Pro</title>
      </Helmet>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Customer Testimonials</h1>
          <p className="text-gray-500 mt-2">Manage the reviews and feedback displayed on your site.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center active:scale-95"
        >
          <Plus className="mr-2 h-5 w-5" /> Add Testimonial
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search testimonials..." 
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-3 flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : filteredTestimonials.length > 0 ? filteredTestimonials.map((testimonial, idx) => (
          <motion.div 
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col relative group"
          >
            <div className="absolute top-6 right-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleOpenModal(testimonial)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleDelete(testimonial.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex text-yellow-400 mb-6">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>

            <div className="relative mb-8">
              <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-50 opacity-10" />
              <p className="text-gray-600 italic leading-relaxed line-clamp-4 relative z-10">"{testimonial.content}"</p>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-50 flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                {testimonial.author[0]}
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{testimonial.author}</h4>
                <p className="text-xs text-gray-400 uppercase tracking-widest">{testimonial.date}</p>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-3 text-center py-24 bg-white rounded-[3rem] shadow-sm border border-gray-100">
            <MessageSquare className="h-16 w-16 text-gray-200 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No testimonials found</h3>
            <p className="text-gray-500">Add some customer reviews to build trust with your visitors.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 md:space-y-8 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-600" /> Customer Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="e.g. Jane Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" /> Date
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center">
                      <Star className="h-4 w-4 mr-2 text-blue-600" /> Rating
                    </label>
                    <div className="flex space-x-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                            formData.rating >= star ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-50 text-gray-300'
                          }`}
                        >
                          <Star className={`h-6 w-6 ${formData.rating >= star ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-blue-600" /> Testimonial Content
                    </label>
                    <textarea
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                      rows={4}
                      placeholder="What did the customer say about your service?"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-grow bg-gray-100 text-gray-700 py-4 rounded-full font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex-grow bg-blue-600 text-white py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>{editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
