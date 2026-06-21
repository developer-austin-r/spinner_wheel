import React, { createContext, useContext, useState, useEffect } from 'react';

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
  fetchPurchases: () => Promise<void>;
  updateSpinner: (id: string, updates: Partial<Spinner>) => Promise<void>;
  addSpinner: (spinnerData: { spinnerName: string; baseAmount: number; setAmount: number }) => Promise<void>;
  addPurchase: (purchase: Omit<Purchase, 'id' | 'timestamp'>) => void;
  addBulkPurchase: (selections: BulkSelection[]) => Promise<void>;
  setWinner: (spinnerId: string, colorIndex: number) => void;
  resetWinner: (spinnerId: string) => void;
  spinnerColors: any[];
  setSelectedWinnerColor: (spinnerId: string, colorIndex: number, amount: string) => Promise<void>;
}

const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

export const SpinnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [spinners, setSpinners] = useState<Spinner[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [spinnerColors, setSpinnerColors] = useState<any[]>([]);

  useEffect(() => {
    fetchSpinnerColors();
  }, []);

  const fetchSpinnerColors = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/spinner-colors`);
      if (response.ok) {
        const data = await response.json();
        setSpinnerColors(data);
      }
    } catch (error) {
      console.error('Failed to fetch spinner colors:', error);
    }
  };

  const fetchSpinners = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/spinners`);
      if (response.ok) {
        const data = await response.json();
        const mappedSpinners = data.map((s: any) => {
          const latestSelection = s.SelectedSpinnerValue?.[0];
          let winnerIndex = null;
          if (latestSelection) {
            const colorSlugs = ['red', 'orange', 'yellow', 'green', 'light-blue', 'blue', 'indigo', 'pink', 'purple'];
            winnerIndex = colorSlugs.indexOf(latestSelection.color.colorSlug);
            if (winnerIndex === -1) winnerIndex = null;
          }

          return {
            id: s.id.toString(),
            title: s.spinnerName,
            amount: s.setAmount,
            enabled: s.activeStatus,
            colors: ['#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6', '#FF2D55', '#AF52DE'],
            winnerColorIndex: winnerIndex,
          };
        });
        setSpinners(mappedSpinners);
      }
    } catch (error) {
      console.error('Failed to fetch spinners:', error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/selected-spinner-values`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const colorSlugs = ['red', 'orange', 'yellow', 'green', 'light-blue', 'blue', 'indigo', 'pink', 'purple'];
        const mappedPurchases = data.map((p: any) => ({
          id: p.id.toString(),
          userId: p.userId.toString(),
          userEmail: p.user.email,
          spinnerId: p.spinnerId.toString(),
          amount: parseFloat(p.amount),
          selectedColorIndex: colorSlugs.indexOf(p.color.colorSlug),
          timestamp: new Date(p.createdAt),
        }));
        setPurchases(mappedPurchases);
      }
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
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

  const updateSpinner = async (id: string, updates: Partial<Spinner>) => {
    try {
      const token = localStorage.getItem('token');
      const backendUpdates: any = {};
      if (updates.title !== undefined) backendUpdates.spinnerName = updates.title;
      if (updates.amount !== undefined) backendUpdates.setAmount = updates.amount;
      if (updates.enabled !== undefined) backendUpdates.activeStatus = updates.enabled;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/spinners/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(backendUpdates),
      });

      if (response.ok) {
        setSpinners(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
      }
    } catch (error) {
      console.error('Failed to update spinner:', error);
    }
  };

  const addPurchase = (purchase: Omit<Purchase, 'id' | 'timestamp'>) => {
    // Local fallback if needed, but we mostly use backend now
    void purchase;
  };

  const addBulkPurchase = async (selections: BulkSelection[]) => {
    try {
      const token = localStorage.getItem('token');
      const backendSelections: any[] = [];
      
      for (const sel of selections) {
        const spinner = spinners.find(s => s.id === sel.spinnerId);
        if (!spinner) continue;
        for (const colorIdx of sel.colorIndices) {
          const colorId = spinnerColors[colorIdx]?.id;
          if (!colorId) continue;

          backendSelections.push({
            spinnerId: parseInt(sel.spinnerId),
            selectedColor: colorId,
            amount: spinner.amount.toString(),
          });
        }
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/selected-spinner-values/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ selections: backendSelections }),
      });

      if (response.ok) {
        await fetchPurchases();
      }
    } catch (error) {
      console.error('Failed to add bulk purchase:', error);
    }
  };

  const setWinner = (spinnerId: string, colorIndex: number) => {
    setSpinners(prev => prev.map(s => s.id === spinnerId ? { ...s, winnerColorIndex: colorIndex } : s));
  };

  const resetWinner = (spinnerId: string) => {
    setSpinners(prev => prev.map(s => s.id === spinnerId ? { ...s, winnerColorIndex: null } : s));
  };

  const setSelectedWinnerColor = async (spinnerId: string, colorIndex: number, amount: string) => {
    try {
      const token = localStorage.getItem('token');
      const colorId = spinnerColors[colorIndex]?.id;
      if (!colorId) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/selected-spinner-values`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          spinnerId: parseInt(spinnerId),
          selectedColor: colorId,
          amount: amount.toString(),
        }),
      });

      if (response.ok) {
        setWinner(spinnerId, colorIndex);
      }
    } catch (error) {
      console.error('Failed to set winner color in DB:', error);
    }
  };

  return (
    <SpinnerContext.Provider value={{ 
      spinners, 
      purchases, 
      fetchSpinners, 
      fetchPurchases,
      updateSpinner, 
      addSpinner, 
      addPurchase, 
      addBulkPurchase, 
      setWinner, 
      resetWinner,
      spinnerColors,
      setSelectedWinnerColor
    }}>
      {children}
    </SpinnerContext.Provider>
  );
};

export const useSpinners = () => {
  const context = useContext(SpinnerContext);
  if (!context) throw new Error('useSpinners must be used within a SpinnerProvider');
  return context;
};
