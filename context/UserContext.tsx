import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { User } from '../models/User';

declare type UserContextType = {
  user: null | User;
};

const UserContext = createContext<UserContextType | null>(null);

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        let res: any = await fetch('/api/user', {
          method: 'GET'
        });

        if (res.status === 200) {
          const response = await res.json();
          setUser(response);
        } else {
          res = await res.json();
          throw new Error(res.error);
        }
      } catch (err) {
        console.log(err); // eslint-disable-line no-console
        setUser(null);
      }
    };

    initialize();
  }, []);

  const userMemo = useMemo(() => ({ user }), [user]);

  return (
    <UserContext.Provider value={userMemo}>{children}</UserContext.Provider>
  );
}

const useUser = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error('UserContext must be placed within UserProvider');
  return context;
};

export { useUser, UserContext, UserProvider };
