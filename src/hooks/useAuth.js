import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!session,
  };
};
// import { useState, useEffect } from 'react';

// export const useAuth = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const stored = localStorage.getItem('auth');
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       setUser(parsed.user);
//     }
//     setLoading(false);
//   }, []);

//   const login = (data) => {
//     localStorage.setItem('auth', JSON.stringify(data));
//     setUser(data.user);
//   };

//   const logout = () => {
//     localStorage.removeItem('auth');
//     setUser(null);
//   };

//   return {
//     user,
//     loading,
//     isAuthenticated: !!user,
//     login,
//     logout,
//   };
// };
