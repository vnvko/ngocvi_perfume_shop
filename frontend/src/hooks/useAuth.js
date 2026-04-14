import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  return (
    useContext(AuthContext) || {
      user: null,
      loading: false,
      login: async () => null,
      register: async () => null,
      logout: () => {},
      updateUser: () => {},
      isAdmin: false,
    }
  );
}
