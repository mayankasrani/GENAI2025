import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maxTasks, setMaxTasks] = useState(0);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('user_stats')
          .select('*')
          .order('taskscompleted', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (data) {
          const formattedData = data.map(user => ({
            username: user.username,
            tasksCompleted: user.taskscompleted || 0
          }));

          setUsers(formattedData);
          
          const max = Math.max(...formattedData.map(user => user.tasksCompleted || 0), 1);
          setMaxTasks(max);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getBarColor = (index) => {
    switch (index) {
      case 0:
        return "linear-gradient(to right, #FFD700, #FFEC8B)";  // Gold
      case 1:
        return "linear-gradient(to right, #C0C0C0, #D3D3D3)";  // Silver
      case 2:
        return "linear-gradient(to right, #CD7F32, #D2691E)";  // Bronze
      default:
        return "linear-gradient(to right, #4B5563, #374151)";  // Gray
    }
  };
  

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-300" />;
      case 2:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="h-6 w-6 flex items-center justify-center font-bold text-gray-400">{index + 1}</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex items-center">
          <Link
            to="/"
            className="mr-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-yellow-400" />
          </Link>
          <h1 className="text-3xl font-bold text-yellow-400">Leaderboard</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Trophy className="h-8 w-8 text-yellow-400" />
            </motion.div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-900/40 border border-red-700 rounded-lg flex items-center gap-2 text-red-200">
            <p>{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center p-8 bg-gray-800/50 rounded-xl border border-gray-700">
            <p className="text-gray-300 text-lg">No users have completed any tasks yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {users.map((user, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-800/50 rounded-xl border border-gray-700"
              >
                <div className="flex items-center mb-2">
                  <div className="mr-3">
                    {getRankIcon(index)}
                  </div>
                  <h3 className="text-xl font-semibold text-yellow-400">{user.username}</h3>
                  <span className="ml-auto text-gray-300"> {user.tasksCompleted} tasks</span>
                </div>
                
                <div className="w-full bg-gray-700/50 rounded-full h-12 overflow-hidden">
                <motion.div
                    className="h-24 rounded-r-full rounded-l-none flex items-center pl-4"
                    style={{ 
                        width: `${(user.tasksCompleted / maxTasks) * 100}%`, 
                        background: getBarColor(index),
                        boarderRadius: '0 50px 50px 0'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(user.tasksCompleted / maxTasks) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    >
                    {user.tasksCompleted > 0 && (
                        <span className="text-lg font-medium text-white drop-shadow-md">
                        {user.tasksCompleted}
                        </span>
                    )}
                    </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
