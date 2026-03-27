import React, { useEffect, useState } from 'react';
import { 
  Users as UsersIcon, 
  Shield, 
  ShieldAlert, 
  UserPlus, 
  Trash2, 
  Search,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt?: any;
}

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleAdmin = async (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await updateDoc(doc(db, 'users', user.id), {
        role: newRole
      });
      setSuccess(`User ${user.email} is now ${newRole}`);
      setTimeout(() => setSuccess(null), 3000);
      fetchUsers();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.id}`);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      setSuccess('User deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
      fetchUsers();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${userId}`);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Helmet>
        <title>User Management | AutoCare Pro</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-gray-500 mt-2">Manage administrative access and user roles.</p>
        </div>
        {success && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-auto bg-green-50 text-green-600 px-6 py-3 rounded-2xl border border-green-100 flex items-center font-bold justify-center md:justify-start"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" /> {success}
          </motion.div>
        )}
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
            <UsersIcon className="h-4 w-4" />
            <span>Total Users: {users.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-sm font-bold text-gray-700 uppercase tracking-wider">User</th>
                <th className="px-8 py-6 text-sm font-bold text-gray-700 uppercase tracking-wider">Role</th>
                <th className="px-8 py-6 text-sm font-bold text-gray-700 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {user.email[0].toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{user.email}</div>
                        <div className="text-xs text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      user.role === 'admin' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role === 'admin' ? (
                        <Shield className="h-3 w-3 mr-1" />
                      ) : (
                        <UsersIcon className="h-3 w-3 mr-1" />
                      )}
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button
                      onClick={() => toggleAdmin(user)}
                      className={`p-2 rounded-xl transition-all ${
                        user.role === 'admin'
                          ? 'text-orange-600 hover:bg-orange-50'
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                      title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                    >
                      {user.role === 'admin' ? <ShieldAlert className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete User"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <UsersIcon className="h-12 w-12 text-gray-200 mb-4" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm">Try adjusting your search term.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
