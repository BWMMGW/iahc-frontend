import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../lib/api';

interface User {
  id: number;
  username: string;
  email: string;
}

export function useAuth(redirectTo = '/login') {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api<{ authenticated: boolean; user?: User }>('/check_session')
      .then((data) => {
        if (!data.authenticated) {
          if (redirectTo) router.replace(redirectTo);
        } else {
          setUser(data.user!);
        }
      })
      .catch(() => {
        if (redirectTo) router.replace(redirectTo);
      })
      .finally(() => setLoading(false));
  }, [redirectTo, router]);

  return { user, loading };
}
