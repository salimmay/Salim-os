"use client";

import React, { useState } from "react";
import { useToast } from "./ToastContext";

const AchievementsContext = React.createContext<any>(null);

export const AchievementsProvider = ({ children }: any) => {
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const { addToast } = useToast();

  const unlock = (id: string, name: string) => {
    if (!unlocked.has(id)) {
      setUnlocked(prev => new Set([...prev, id]));
      addToast(`🏆 Achievement Unlocked: ${name}`, 'achievement');
    }
  };

  return (
    <AchievementsContext.Provider value={{ unlocked, unlock }}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => {
  const context = React.useContext(AchievementsContext);
  if (!context) throw new Error('useAchievements must be used within AchievementsProvider');
  return context;
};
