import React, { createContext, useContext, useState } from 'react';

export interface Spinner {
  id: string;
  title: string;
  amount: number;
  enabled: boolean;
  colors: string[];
  winnerColorIndex?: number | null;
}

export interface Purchase {
  id: string;
  userId: string;
  userEmail: string;
  spinnerId: string;
  amount: number;
  selectedColorIndex: number;
  timestamp: Date;
}

interface SpinnerContextType {
  spinners: Spinner[];
  purchases: Purchase[];
  updateSpinner: (id: string, updates: Partial<Spinner>) => void;
  addPurchase: (purchase: Omit<Purchase, 'id' | 'timestamp'>) => void;
  setWinner: (spinnerId: string, colorIndex: number) => void;
  resetWinner: (spinnerId: string) => void;
}

const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

const INITIAL_SPINNERS: Spinner[] = [
  {
    id: '1',
    title: 'Classic Wheel',
    amount: 100,
    enabled: true,
    colors: ['#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6', '#FF2D55', '#AF52DE'],
    winnerColorIndex: null,
  },
  {
    id: '2',
    title: 'Bonus Wheel',
    amount: 200,
    enabled: true,
    colors: ['#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6', '#FF2D55', '#AF52DE'],
    winnerColorIndex: null,
  },
  {
    id: '3',
    title: 'Mega Jackpot',
    amount: 500,
    enabled: true,
    colors: ['#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6', '#FF2D55', '#AF52DE'],
    winnerColorIndex: null,
  },
];

export const SpinnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [spinners, setSpinners] = useState<Spinner[]>(INITIAL_SPINNERS);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const updateSpinner = (id: string, updates: Partial<Spinner>) => {
    setSpinners(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addPurchase = (purchase: Omit<Purchase, 'id' | 'timestamp'>) => {
    const newPurchase: Purchase = {
      ...purchase,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    setPurchases(prev => [newPurchase, ...prev]);
  };

  const setWinner = (spinnerId: string, colorIndex: number) => {
    setSpinners(prev => prev.map(s => s.id === spinnerId ? { ...s, winnerColorIndex: colorIndex } : s));
  };

  const resetWinner = (spinnerId: string) => {
    setSpinners(prev => prev.map(s => s.id === spinnerId ? { ...s, winnerColorIndex: null } : s));
  };

  return (
    <SpinnerContext.Provider value={{ spinners, purchases, updateSpinner, addPurchase, setWinner, resetWinner }}>
      {children}
    </SpinnerContext.Provider>
  );
};

export const useSpinners = () => {
  const context = useContext(SpinnerContext);
  if (!context) throw new Error('useSpinners must be used within a SpinnerProvider');
  return context;
};
