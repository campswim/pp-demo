'use client';

import { createContext, useContext, useState } from 'react';

type LoggedInContextType = {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  role: 'guest' | 'member' | 'admin';
  setRole: (role: 'guest' | 'member' | 'admin') => void;
};

type LoggedInProviderProps = {
  children: React.ReactNode;
};

const LoggedInContext = createContext<LoggedInContextType | undefined>(undefined);

export function LoggedInProvider({ children }: LoggedInProviderProps) {
  const [loggedIn, setLoggedIn] = useState(true);
  const [role, setRole] = useState<'guest' | 'member' | 'admin'>('admin');

  return (
    <LoggedInContext.Provider value={{ loggedIn, setLoggedIn, role, setRole }}>
      {children}
    </LoggedInContext.Provider>
  );
};

export const useLoggedIn = () => {
  const context = useContext(LoggedInContext);

  if (context === undefined) throw new Error('useLoggedIn must be used within a LoggedInProvider');
  else return context;
};
