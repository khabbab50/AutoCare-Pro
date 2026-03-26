import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Share2, 
  Facebook, 
  Twitter, 
  Instagram,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Post } from '../types';
import { Helmet } from 'react-helmet-async';

export const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'posts'), where('slug', '==', slug), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setPost({ id: doc.id, ...doc.data() } as Post);
        } else {
          navigate('/blog');
        }

        const recentQ = query(collection(db, 'posts'), orderBy('date', 'desc'), limit(3));
        const recentSnap = await getDocs(recentQ);
        setRecentPosts(recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)).filter(p => p.slug !== slug));
      } catch (error) {
        console.error('Error fetching post data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="bg-white min-h-screen pb-24">
      <Helmet>
        <title>{post.title} | AutoCare Pro Blog</title>
        <meta name="description" content={post.content.substring(0, 160)} />
      </Helmet>

      {/* Hero Header */}
      <div className="bg-gray-900 py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src={post.image || "https://picsum.photos/seed/autocare-blog-detail/1920/1080"} 
            alt={post.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Link to="/blog" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 font-bold transition-colors group">
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-8"
          >
            {post.title}
          </motion.h1>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-bold text-gray-300 uppercase tracking-widest">
            <span className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-blue-500" /> {post.date}</span>
            <span className="flex items-center"><User className="h-4 w-4 mr-2 text-blue-500" /> {post.author}</span>
            <span className="flex items-center"><Clock className="h-4 w-4 mr-2 text-blue-500" /> 5 Min Read</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-gray-100"
            >
              <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed space-y-8">
                {post.content.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Share Section */}
              <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex items-center space-x-3 text-gray-900 font-bold">
                  <Share2 className="h-5 w-5 text-blue-600" />
                  <span>Share this article:</span>
                </div>
                <div className="flex space-x-4">
                  <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                    <Facebook className="h-5 w-5" />
                  </button>
                  <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                    <Twitter className="h-5 w-5" />
                  </button>
                  <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                    <Instagram className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            {/* Recent Posts */}
            <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Recent Posts</h3>
              <div className="space-y-8">
                {recentPosts.map((recent) => (
                  <Link key={recent.id} to={`/blog/${recent.slug}`} className="group block">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                        <img 
                          src={recent.image || "https://picsum.photos/seed/autocare-blog-card/200/200"} 
                          alt={recent.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">{recent.date}</p>
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                          {recent.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/blog" className="mt-10 flex items-center text-gray-900 font-bold hover:text-blue-600 transition-colors group">
                View All Posts <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Newsletter Card */}
            <div className="bg-blue-600 p-10 rounded-[3rem] shadow-2xl shadow-blue-600/20 text-white">
              <h3 className="text-2xl font-bold mb-6">Stay Informed</h3>
              <p className="text-blue-100 mb-8 leading-relaxed">
                Get the latest maintenance tips and news delivered to your inbox.
              </p>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:ring-2 focus:ring-white transition-all"
                />
                <button className="w-full bg-white text-blue-600 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-xl">
                  Subscribe
                </button>
              </form>
            </div>

            {/* CTA Card */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Need Service?</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Schedule your maintenance or repair online today.
              </p>
              <Link 
                to="/booking" 
                className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700 group"
              >
                Book Appointment <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
