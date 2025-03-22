import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userStats, setUserStats] = useState(null);

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
    <UserContext.Provider value={{ userStats, updateUserStats, getUserStats }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);