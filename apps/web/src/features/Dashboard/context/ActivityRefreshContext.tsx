"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface ActivityRefreshContextType {
  refreshCounter: number;
  triggerRefresh: () => void;
}

const ActivityRefreshContext = createContext<ActivityRefreshContextType | undefined>(undefined);

export function ActivityRefreshProvider({ children }: { children: React.ReactNode }) {
  const [refreshCounter, setRefreshCounter] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
  }, []);

  return (
    <ActivityRefreshContext.Provider value={{ refreshCounter, triggerRefresh }}>
      {children}
    </ActivityRefreshContext.Provider>
  );
}

export function useActivityRefresh() {
  const context = useContext(ActivityRefreshContext);
  if (context === undefined) {
    throw new Error("useActivityRefresh must be used within ActivityRefreshProvider");
  }
  return context;
}
