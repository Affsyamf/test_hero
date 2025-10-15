import { createContext, useContext } from 'react';

// Buat Context
export const AuthContext = createContext(null);

// Hook untuk ambil data context
export function useAuth() {
  return useContext(AuthContext);
}
