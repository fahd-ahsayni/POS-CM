import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ShiftContextType {
  shiftId: string | null;
  setShiftId: (id: string | null) => void;
}

const ShiftContext = createContext<ShiftContextType | null>(null);

export const ShiftProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shiftId, setShiftId] = useState<string | null>(
    localStorage.getItem("shiftId") || null
  );

  return (
    <ShiftContext.Provider value={{ shiftId, setShiftId }}>
      {children}
    </ShiftContext.Provider>
  );
};

export const useShift = (): ShiftContextType => {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error('useShift must be used within a ShiftProvider');
  }
  return context;
};