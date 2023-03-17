import React, { createContext, useContext, useState } from 'react';

interface ActivityLog {
  latitude: number;
  longitude: number;
  activity: string;
}

interface ActivityLogContextData {
  logs: ActivityLog[];
  addLog: (log: ActivityLog) => void;
}

const ActivityLogContext = createContext<ActivityLogContextData>({
  logs: [],
  addLog: () => {},
});

export const useActivityLog = () => useContext(ActivityLogContext);

interface ActivityLogProviderProps {
  children: React.ReactNode;
}

export const ActivityLogProvider: React.FC<ActivityLogProviderProps> = ({ children }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  const addLog = (log: ActivityLog) => {
    setLogs((prevLogs) => [...prevLogs, log]);
  };

  return (
    <ActivityLogContext.Provider value={{ logs, addLog }}>
      {children}
    </ActivityLogContext.Provider>
  );
};
