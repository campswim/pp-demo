'use client';

import { createContext, useContext, useState } from 'react';

type LoggedInContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

type LoggedInProviderProps = {
  children: React.ReactNode;
};

const LoggedInContext = createContext<LoggedInContextType | undefined>(undefined);

export function LoggedInProvider({ children }: LoggedInProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <LoggedInContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoggedInContext.Provider>
  );
};

export const useLoggedIn = () => {
  const context = useContext(LoggedInContext);
  if (context === undefined) {
    throw new Error('useLoggedIn must be used within a LoggedInProvider');
  }
  return context;
};
