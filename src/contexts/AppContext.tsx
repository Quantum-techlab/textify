
import { createContext, useContext, ReactNode } from 'react';

type AppContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ 
  children, 
  value 
}: { 
  children: ReactNode; 
  value: AppContextType 
}) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  
  return context;
};
