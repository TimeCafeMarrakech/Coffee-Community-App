export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'Working' | 'Networking' | 'Learning' | 'Socializing';
  lookingFor?: string[];
  isHere: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Espresso' | 'Matcha' | 'Pastries' | 'Food' | 'Beans';
  tags?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  attendees: number;
  image: string;
  type: string;
}

export interface Experience {
  id: string;
  title: string;
  host: string;
  price: number;
  duration: string;
  image: string;
  category: 'Coworking' | 'Classes' | 'Workshops';
  rating: number;
  reviews: number;
}

export type OrderType = 'dine-in' | 'takeout';

export interface Order {
  id: string;
  items: CartItem[];
  type: OrderType;
  tableNumber?: string;
  status: 'pending' | 'completed';
  timestamp: Date;
  total: number;
}

export interface ServiceRequest {
  id: string;
  serviceType: string;
  tableNumber: string;
  status: 'pending' | 'resolved';
  timestamp: Date;
}
