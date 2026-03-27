import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Car, 
  AlertCircle,
  ShieldCheck,
  LogIn
} from 'lucide-react';
import { motion } from 'motion/react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';

export const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let user;
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      }
      
      // Check if user is admin
      const userDocRef = doc(db, 'users', user.uid);
      let userDoc;
      try {
        userDoc = await getDoc(userDocRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
        return;
      }
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        const role = user.email === 'khabbab.dev@gmail.com' ? 'admin' : 'user';
        try {
          await setDoc(userDocRef, {
            email: user.email,
            role: role,
            createdAt: new Date()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
          return;
        }
        
        if (role === 'admin') {
          navigate('/admin');
        } else {
          setError('Account created. Please wait for administrative approval to access the panel.');
        }
        return;
      }

      const userData = userDoc.data();
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        setError('You do not have administrative access. Please contact the site owner.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDocRef = doc(db, 'users', user.uid);
      let userDoc;
      try {
        userDoc = await getDoc(userDocRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
        return;
      }
      
      if (!userDoc.exists()) {
        const role = user.email === 'khabbab.dev@gmail.com' ? 'admin' : 'user';
        try {
          await setDoc(userDocRef, {
            email: user.email,
            role: role,
            createdAt: new Date()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
          return;
        }
        
        if (role === 'admin') {
          navigate('/admin');
        } else {
          setError('Google account linked. Please wait for administrative approval.');
        }
        return;
      }

      const userData = userDoc.data();
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        setError('You do not have administrative access.');
      }
    } catch (err: any) {
      setError(err.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>Admin Login | AutoCare Pro</title>
      </Helmet>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-xl shadow-blue-600/20">
            <Car className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900 tracking-tight">
          Admin <span className="text-blue-600">{isSignUp ? 'Registration' : 'Access'}</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isSignUp ? 'Create your admin account to get started.' : 'Sign in to manage your services, bookings, and content.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 md:py-10 px-6 md:px-12 shadow-2xl rounded-3xl md:rounded-[3rem] border border-gray-100"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-2xl flex items-start space-x-3 text-red-700 border border-red-100">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleAuth}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-blue-600" /> Email Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="admin@autocarepro.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <Lock className="h-4 w-4 mr-2 text-blue-600" /> Password
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>{isSignUp ? 'Sign Up' : 'Sign In'} <LogIn className="ml-2 h-5 w-5" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-4 border border-gray-100 rounded-full shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
              >
                <img className="h-5 w-5 mr-3" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" />
                Sign in with Google
              </button>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-400 text-sm">
              <ShieldCheck className="h-4 w-4" />
              <span>Secure Administrative Access</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
