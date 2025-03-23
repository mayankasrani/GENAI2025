import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

// Create the context
const UserContext = createContext();

// Export the context directly
export default UserContext;

export function UserProvider({ children }) {
  const [userStats, setUserStats] = useState(null);
  const [user, setUser] = useState(null);

  // Add effect to get the current user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };
    
    getUser();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );
    
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const updateUserStats = async (statsUpdate) => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .upsert({
          ...statsUpdate,
          lastUpdated: new Date()
        });

      if (error) throw error;
      setUserStats(data);
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  };

  const getUserStats = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('userId', userId)
        .single();

      if (error) throw error;
      setUserStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userStats, updateUserStats, getUserStats, user }}>
      {children}
    </UserContext.Provider>
  );
}

// Export a custom hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};