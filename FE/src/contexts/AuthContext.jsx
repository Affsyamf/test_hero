import { createContext, useContext } from 'react';

// Buat Context
export const AuthContext = createContext(null);

//hook get data
export function useAuth() {
  return useContext(AuthContext);
}
