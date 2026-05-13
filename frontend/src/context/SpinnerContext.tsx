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

interface BulkSelection {
  spinnerId: string;
  colorIndices: number[];
}

interface SpinnerContextType {
  spinners: Spinner[];
  purchases: Purchase[];
  fetchSpinners: () => Promise<void>;
  updateSpinner: (id: string, updates: Partial<Spinner>) => void;
  addSpinner: (spinnerData: { spinnerName: string; baseAmount: number; setAmount: number }) => Promise<void>;
  addPurchase: (purchase: Omit<Purchase, 'id' | 'timestamp'>) => void;
  addBulkPurchase: (selections: BulkSelection[], userId: string, userEmail: string) => void;
  setWinner: (spinnerId: string, colorIndex: number) => void;
  resetWinner: (spinnerId: string) => void;
}
const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

export const SpinnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [spinners, setSpinners] = useState<Spinner[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const fetchSpinners = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/spinners`);
      if (response.ok) {
        const data = await response.json();
        const mappedSpinners = data.map((s: any) => ({
          id: s.id.toString(),
          title: s.spinnerName,
          amount: s.setAmount,
          enabled: s.activeStatus,
          colors: ['#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6', '#FF2D55', '#AF52DE'],
          winnerColorIndex: null,
        }));
        setSpinners(mappedSpinners);
      }
    } catch (error) {
      console.error('Failed to fetch spinners:', error);
    }
  };

  const addSpinner = async (spinnerData: { spinnerName: string; baseAmount: number; setAmount: number }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/spinners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(spinnerData),
      });
      if (response.ok) {
        await fetchSpinners();
      }
    } catch (error) {
      console.error('Failed to add spinner:', error);
    }
  };

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

  const addBulkPurchase = (selections: BulkSelection[], userId: string, userEmail: string) => {
    const newPurchases: Purchase[] = [];
    for (const sel of selections) {
      const spinner = spinners.find(s => s.id === sel.spinnerId);
      if (!spinner) continue;
      for (const colorIdx of sel.colorIndices) {
        newPurchases.push({
          id: Math.random().toString(36).substr(2, 9),
          userId,
          userEmail,
          spinnerId: sel.spinnerId,
          amount: spinner.amount,
          selectedColorIndex: colorIdx,
          timestamp: new Date(),
        });
      }
    }
    setPurchases(prev => [...newPurchases, ...prev]);
  };

  const setWinner = (spinnerId: string, colorIndex: number) => {
    setSpinners(prev => prev.map(s => s.id === spinnerId ? { ...s, winnerColorIndex: colorIndex } : s));
  };

  const resetWinner = (spinnerId: string) => {
    setSpinners(prev => prev.map(s => s.id === spinnerId ? { ...s, winnerColorIndex: null } : s));
  };

  return (
    <SpinnerContext.Provider value={{ spinners, purchases, fetchSpinners, updateSpinner, addSpinner, addPurchase, addBulkPurchase, setWinner, resetWinner }}>
      {children}
    </SpinnerContext.Provider>
  );
};

export const useSpinners = () => {
  const context = useContext(SpinnerContext);
  if (!context) throw new Error('useSpinners must be used within a SpinnerProvider');
  return context;
};

