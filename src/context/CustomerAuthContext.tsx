'use client';

import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from 'react';
import toast from 'react-hot-toast';

export type CustomerUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

type CustomerAuthContextType = {
  user: CustomerUser | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string, silent?: boolean) => Promise<boolean>;
  register: (data: { name: string; email: string; phone: string }) => Promise<boolean>;
  loginAsDemo: () => void;
  logout: () => void;
};

const CustomerAuthContext = createContext<CustomerAuthContextType | null>(null);

const STORAGE_KEY = 'giftory_customer_session';

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse customer session', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to update customer session', e);
    }
  }, [user, isLoaded]);

  const openAuthModal = useCallback((tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = useCallback(async (email: string, silent = false) => {
    if (!email) {
      toast.error('กรุณากรอกอีเมล');
      return false;
    }
    // Prototype login: generate name from email or use default
    const mockName = email.split('@')[0] || 'ลูกค้า Giftory';
    const mockUser: CustomerUser = {
      id: `cust_${Date.now()}`,
      name: mockName.charAt(0).toUpperCase() + mockName.slice(1),
      email,
      phone: '081-234-5678',
    };
    setUser(mockUser);
    if (!silent) {
      toast.success(`ยินดีต้อนรับคุณ ${mockUser.name}`);
    }
    setIsAuthModalOpen(false);
    return true;
  }, []);

  const register = useCallback(async (data: { name: string; email: string; phone: string }) => {
    if (!data.name || !data.email || !data.phone) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return false;
    }
    const newUser: CustomerUser = {
      id: `cust_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
    };
    setUser(newUser);
    toast.success(`สมัครสมาชิกสำเร็จ ยินดีต้อนรับคุณ ${data.name}`);
    setIsAuthModalOpen(false);
    return true;
  }, []);

  const loginAsDemo = useCallback(() => {
    const demoUser: CustomerUser = {
      id: 'cust_demo_01',
      name: 'สมชาย รักของขวัญ',
      email: 'somchai@example.com',
      phone: '089-999-8888',
      address: '99/1 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กทม. 10110',
    };
    setUser(demoUser);
    toast.success('เข้าสู่ระบบด้วยบัญชีทดสอบเรียบร้อย');
    setIsAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    toast('ออกจากระบบเรียบร้อยแล้ว');
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      isAuthModalOpen,
      authModalTab,
      openAuthModal,
      closeAuthModal,
      login,
      register,
      loginAsDemo,
      logout,
    }),
    [user, isAuthModalOpen, authModalTab, openAuthModal, closeAuthModal, login, register, loginAsDemo, logout]
  );

  return <CustomerAuthContext.Provider value={contextValue}>{children}</CustomerAuthContext.Provider>;
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};
