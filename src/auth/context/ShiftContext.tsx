import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ShiftContextType {
  shiftId: string | undefined;
  setShiftId: (id: string | undefined) => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shiftId, setShiftId] = useState<string | undefined>(
    localStorage.getItem("shiftId") || undefined
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