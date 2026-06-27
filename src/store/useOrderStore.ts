import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  color?: string;
  size?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  address: string;
  city: string;
  district: string;
  items: OrderItem[];
  total: number;
  status: 'beklemede' | 'hazirlaniyor' | 'kargoda' | 'teslim-edildi' | 'iptal';
  createdAt: string;
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  removeOrder: (id: string) => void;
}

// Demo siparişler
const demoOrders: Order[] = [
  {
    id: 'ORD-2025-001',
    customerName: 'Ferhat Taspinar',
    customerEmail: 'ferhat@example.com',
    address: 'Atatürk Mah. Cumhuriyet Cad. No:42',
    city: 'İstanbul',
    district: 'Kadıköy',
    items: [
      { id: 'decoroys-valens-tv-unitesi', name: 'Decoroys Valens TV Ünitesi', price: 9200, quantity: 1, image: '/images/tv.png' },
    ],
    total: 9200,
    status: 'beklemede',
    createdAt: '2025-06-09T14:30:00Z',
  },
  {
    id: 'ORD-2025-002',
    customerName: 'sena Yılmaz',
    customerEmail: 'sena@example.com',
    address: 'Bağdat Cad. No:128/A',
    city: 'İstanbul',
    district: 'Maltepe',
    items: [
      { id: 'decoroys-luna-tv-unitesi', name: 'Decoroys Luna TV Ünitesi', price: 11500, quantity: 1, image: '/images/tv.png' },
      { id: 'decoroys-violet-tv-unitesi', name: 'Decoroys Violet TV Ünitesi', price: 8500, quantity: 2, image: '/images/tv.png' },
    ],
    total: 28500,
    status: 'hazirlaniyor',
    createdAt: '2025-06-08T09:15:00Z',
  },
  {
    id: 'ORD-2025-003',
    customerName: 'Mehmet Kaya',
    customerEmail: 'mehmet@example.com',
    address: 'Kültür Mah. Ege Sok. No:7',
    city: 'İzmir',
    district: 'Bornova',
    items: [
      { id: 'decoroys-horizon-tv-unitesi', name: 'Decoroys Horizon TV Ünitesi', price: 14500, quantity: 1, image: '/images/tv.png' },
    ],
    total: 14500,
    status: 'kargoda',
    createdAt: '2025-06-07T16:45:00Z',
  },
  {
    id: 'ORD-2025-004',
    customerName: 'Zeynep Demir',
    customerEmail: 'zeynep@example.com',
    address: 'Çankaya Cad. No:55',
    city: 'Ankara',
    district: 'Çankaya',
    items: [
      { id: 'decoroys-crystal-tv-unitesi', name: 'Decoroys Crystal TV Ünitesi', price: 15800, quantity: 1, image: '/images/tv.png' },
    ],
    total: 15800,
    status: 'teslim-edildi',
    createdAt: '2025-06-05T11:00:00Z',
  },
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: demoOrders,
      addOrder: (order) => set((state) => ({
        orders: [order, ...state.orders],
      })),
      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? { ...order, status } : order
        ),
      })),
      removeOrder: (id) => set((state) => ({
        orders: state.orders.filter((order) => order.id !== id),
      })),
    }),
    {
      name: 'decoroys-orders-storage',
    }
  )
);
