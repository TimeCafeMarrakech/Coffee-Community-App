import { User, Product, Event, Experience } from './types';

export const currentUser = {
  name: "Taylor",
  points: 350,
  tier: "Gold",
  nextTierPoints: 500,
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
};

export const communityMembers: User[] = [
  {
    id: '1',
    name: 'Sarah M.',
    role: 'UX Designer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    status: 'Working',
    lookingFor: ['Freelance gigs', 'Coffee chats'],
    isHere: true
  },
  {
    id: '2',
    name: 'Karim B.',
    role: 'Startup Founder',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    status: 'Networking',
    lookingFor: ['Technical Co-founder', 'Investors'],
    isHere: true
  },
  {
    id: '3',
    name: 'Elena R.',
    role: 'Digital Nomad',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    status: 'Learning',
    lookingFor: ['Language exchange (French/English)'],
    isHere: true
  }
];

export const menuItems: Product[] = [
  // Espresso
  {
    id: 'p1',
    name: 'Oat Milk Latte',
    description: 'Our signature espresso blend with perfectly steamed oat milk and beautiful latte art.',
    price: 45,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80',
    category: 'Espresso',
    tags: ['Hot', 'Signature']
  },
  {
    id: 'p2',
    name: 'Iced Lavender Latte',
    description: 'Smooth, refreshing, and made with real house-made lavender syrup.',
    price: 55,
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=400&q=80',
    category: 'Espresso',
    tags: ['Cold', 'Seasonal']
  },
  {
    id: 'p3',
    name: 'Cortado',
    description: 'Equal parts espresso and steamed milk. A perfect balance for the true coffee lover.',
    price: 35,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80',
    category: 'Espresso',
    tags: ['Hot', 'Strong']
  },
  
  // Matcha
  {
    id: 'p4',
    name: 'Ceremonial Iced Matcha',
    description: 'Premium ceremonial grade matcha from Uji, Japan, whisked to perfection over ice.',
    price: 65,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80',
    category: 'Matcha',
    tags: ['Cold', 'Premium']
  },
  {
    id: 'p5',
    name: 'Strawberry Matcha Latte',
    description: 'Layered iced matcha with house-made strawberry puree and your choice of milk.',
    price: 70,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80',
    category: 'Matcha',
    tags: ['Cold', 'Sweet']
  },

  // Pastries
  {
    id: 'p6',
    name: 'Butter Croissant',
    description: 'Flaky, buttery, and baked fresh every morning. A French classic.',
    price: 25,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80',
    category: 'Pastries',
    tags: ['Fresh Baked']
  },
  {
    id: 'p7',
    name: 'Opéra Cake Slice',
    description: 'Layers of almond sponge cake soaked in coffee syrup, layered with ganache and coffee buttercream.',
    price: 55,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
    category: 'Pastries',
    tags: ['Dessert', 'Premium']
  },
  {
    id: 'p8',
    name: 'Valrhona Fudge Brownie',
    description: 'Decadent, rich, and dense brownie made with 70% dark Valrhona chocolate.',
    price: 40,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80',
    category: 'Pastries',
    tags: ['Rich', 'Chocolate']
  }
];

export const experiences: Experience[] = [
  {
    id: 'exp1',
    title: 'Latte Art Masterclass',
    host: 'TIME Head Barista',
    price: 350,
    duration: '2 hours',
    image: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=600&q=80',
    category: 'Classes',
    rating: 4.9,
    reviews: 124
  },
  {
    id: 'exp2',
    title: 'Premium Hot Desk',
    host: 'TIME Coworking',
    price: 150,
    duration: 'Full Day',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    category: 'Coworking',
    rating: 4.8,
    reviews: 89
  },
  {
    id: 'exp3',
    title: 'STEM Robotics Workshop',
    host: 'Tech Hub Marrakech',
    price: 200,
    duration: '3 hours',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
    category: 'Workshops',
    rating: 5.0,
    reviews: 42
  },
  {
    id: 'exp4',
    title: 'Moroccan Coffee Tasting',
    host: 'Local Artisans',
    price: 180,
    duration: '1.5 hours',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    category: 'Classes',
    rating: 4.7,
    reviews: 215
  }
];
