import { createContext, useContext, useState, ReactNode } from 'react';

type ErrorContextType = {
  storageError: string | null;
  setStorageError: (msg: string | null) => void;
};

const ErrorContext = createContext<ErrorContextType>({ storageError: null, setStorageError: () => {} });

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [storageError, setStorageError] = useState<string | null>(null);
  return (
    <ErrorContext.Provider value={{ storageError, setStorageError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() { return useContext(ErrorContext); }
