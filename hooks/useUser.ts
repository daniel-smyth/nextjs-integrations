import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const useUser = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error('UserContext must be placed within UserProvider');
  return context;
};

export default useUser;
