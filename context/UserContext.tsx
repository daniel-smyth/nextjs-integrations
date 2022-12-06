import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Integration } from '../models/Integration';
import { User } from '../models/User';

declare type UserContextType = {
  user: null | User;
  saveIntegration: (integration: Integration) => Promise<Integration>;
};

const UserContext = createContext<UserContextType | null>(null);

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<null | User>(null);

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

  const saveIntegration = async (integration: Integration) => {
    const body = JSON.stringify(integration);

    let res: any = await fetch(`/api/integrations/${integration.name}`, {
      method: 'PUT',
      body
    });

    if (res.status === 200) {
      const response: Integration = await res.json();
      return response;
    }

    res = await res.json();
    throw new Error(res.error);
  };

  const userMemo = useMemo(() => ({ user, saveIntegration }), [user]);

  return (
    <UserContext.Provider value={userMemo}>{children}</UserContext.Provider>
  );
}

export { UserContext, UserProvider };
