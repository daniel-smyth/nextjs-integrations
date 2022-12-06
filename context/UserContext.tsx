import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState
} from 'react';
import { User } from '../models/User';

const UserContext = createContext<{ user: null | User } | null>(null);

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<null | User>(null);
  const userMemo = useMemo(() => ({ user }), [user]);

  useEffect(() => {
    const initialize = async () => {
      try {
        let user: User; // eslint-disable-line @typescript-eslint/no-shadow

        let res: any = await fetch('/api/user', {
          method: 'GET'
        });

        if (res.status === 200) {
          user = await res.json();
        } else {
          res = await res.json();
          throw new Error(res.error);
        }

        setUser(user);
      } catch (err) {
        console.log(err); // eslint-disable-line no-console
        setUser(null);
      }
    };

    initialize();
  }, []);

  return (
    <UserContext.Provider value={userMemo}>{children}</UserContext.Provider>
  );
}

export { UserContext, UserProvider };
