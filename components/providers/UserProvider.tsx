'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

interface UserType {
  id: string;
  fullName: string;
  email: string;
  role: string;
  companyId?: string;
  companyName?: string;
  avatar?: string;
}

interface UserContextType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        fullName: session.user.name || '',
        email: session.user.email,
        role: session.user.role,
        companyId: session.user.companyId,
        companyName: session.user.companyName,
        avatar: session.user.avatar,
      });
    } else if (status === 'unauthenticated') {
      setUser(null);
    }
  }, [session, status]);

  const logout = () => {
    setUser(null);
    signOut({ callbackUrl: '/login' });
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};