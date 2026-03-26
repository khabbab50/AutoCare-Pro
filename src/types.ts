export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  price?: string;
  image?: string;
  slug: string;
}

export interface Testimonial {
  id: string;
  author: string;
  content: string;
  rating: number;
  date: string;
}

export interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  serviceId: string;
  date: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
  slug: string;
  author: string;
}

export interface Settings {
  siteName: string;
  contactEmail: string;
  phone: string;
  address: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
}
