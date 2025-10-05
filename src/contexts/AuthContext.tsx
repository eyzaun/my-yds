// src/contexts/AuthContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange } from '@/firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Boş varsayılan değerler
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // İstemci tarafında olduğumuzdan emin olalım
    if (typeof window !== 'undefined') {
      const unsubscribe = onAuthChange((authUser) => {
        setUser(authUser);
        setLoading(false);
      });

      // Cleanup fonksiyonu
      return () => unsubscribe();
    } else {
      // Sunucu tarafında varsayılan değerleri ayarlayalım
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;