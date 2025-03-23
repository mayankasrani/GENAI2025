import React, { useState, useEffect, useContext } from "react";
import UserContext from "../context/UserContext"; // Updated import
import { supabase } from "../services/supabaseClient";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const MyTasks = () => {
  // Use useContext with the imported UserContext
  const { user } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Remove the user state and getUser effect since we're getting it from context

  // Fetch tasks when user is available
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTasks(data || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load your previous tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <p>Please sign in to view your tasks</p>
        <Link
          to="/signin"
          className="mt-4 font-semibold text-lg py-2 px-3 rounded-xl transition-all duration-300 shadow-lg bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-400 hover:to-amber-400 text-black flex items-center justify-center"
        >
          Sign In
        </Link>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-yellow-400">My Previous Tasks</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="h-8 w-8 text-yellow-400" />
            </motion.div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-900/40 border border-red-700 rounded-lg flex items-center gap-2 text-red-200">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p>{error}</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center p-8 bg-gray-800/50 rounded-xl border border-gray-700">
            <p className="text-gray-300 text-lg">You haven't created any tasks yet</p>
            <Link
              to="/"
              className="mt-4 inline-block font-semibold text-lg py-2 px-4 rounded-xl transition-all duration-300 shadow-lg bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black"
            >
              Create Your First Task
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-yellow-400">{task.query}</h3>
                  <span className="text-xs text-gray-400">
                    {new Date(task.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300">{task.analysis}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;