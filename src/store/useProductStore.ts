import { create } from 'zustand';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { type Product } from '@/data/products';

interface ProductState {
  products: Product[];
  loading: boolean;
}

export const useProductStore = create<ProductState>(() => ({
  products: [],
  loading: true,
}));

let _unsubscribe: (() => void) | null = null;

export function initProductStore() {
  if (_unsubscribe) return () => {};

  const unsubscribe = onSnapshot(
    collection(db, 'products'),
    (snapshot) => {
      const firebaseProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      useProductStore.setState({
        products: firebaseProducts,
        loading: false,
      });
    },
    () => {
      useProductStore.setState({ loading: false });
    }
  );

  _unsubscribe = unsubscribe;

  return () => {
    unsubscribe();
    _unsubscribe = null;
    useProductStore.setState({ products: [], loading: true });
  };
}
