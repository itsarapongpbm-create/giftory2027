'use client';

import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from 'react';
import toast from 'react-hot-toast';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  categorySlug?: string;
  categoryName?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (
    product: {
      id: string;
      title: string;
      price?: number;
      image: string;
      categorySlug?: string;
      categoryName?: string;
    },
    quantity?: number,
    openDrawer?: boolean
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'giftory_cart_items';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to parse cart from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items, isLoaded]);

  const addItem: CartContextType['addItem'] = useCallback(
    (product, quantity = 1, openDrawer = true) => {
      if (!product.price || product.price <= 0) {
        toast.error('สินค้านี้ต้องติดต่อเจ้าหน้าที่เพื่อประเมินราคา');
        return;
      }

      const price = product.price;

      setItems(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [
          ...prev,
          {
            id: product.id,
            title: product.title,
            price,
            image: product.image,
            quantity,
            categorySlug: product.categorySlug,
            categoryName: product.categoryName,
          },
        ];
      });

      toast.success(`เพิ่ม "${product.title}" ลงในตะกร้าแล้ว`);

      if (openDrawer) {
        setIsCartOpen(true);
      }
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item) {
        toast(`นำ "${item.title}" ออกจากตะกร้าแล้ว`);
      }
      return prev.filter(i => i.id !== id);
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => {
        const item = prev.find(i => i.id === id);
        if (item) {
          toast(`นำ "${item.title}" ออกจากตะกร้าแล้ว`);
        }
        return prev.filter(i => i.id !== id);
      });
      return;
    }
    setItems(prev => prev.map(item => (item.id === id ? { ...item, quantity } : item)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const contextValue = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      isCartOpen,
      openCart,
      closeCart,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal, isCartOpen, openCart, closeCart]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
