import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Sparkles, History, Award } from 'lucide-react';
import UserContext from "../context/UserContext";

const Header = () => {
  // Get user information from context
  const { user } = useContext(UserContext);

  return (
    <div className="relative w-full p-4">
      {!user ? (
        // Non-signed in header
        <div className="absolute top-4 flex space-x-4 justify-center items-center left-1/2 transform -translate-x-1/2">
          <Link 
            to="/signin" 
            className="font-semibold text-lg py-2 px-3 rounded-xl transition-all duration-300 shadow-lg bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-400 hover:to-amber-400 text-black flex items-center justify-center hover:-translate-y-0.5"
          >
            Sign In
          </Link>
          <p className="px-3 text-gray-300">or</p>
          <Link 
            to="/signup" 
            className="font-semibold text-lg py-2 px-3 rounded-xl transition-all duration-300 shadow-lg bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-black flex items-center justify-center hover:-translate-y-0.5"
          >
            Sign Up
          </Link>
          <p className="px-3 text-gray-300">to receive personalized insights</p>
        </div>
      ) : (
        // Signed in header - now using flexbox with vertical layout
        <div className="absolute top-4 w-full flex flex-col items-center py-2 px-4 space-y-4">
          {/* Top row - Greeting */}
          <div className="w-full flex justify-end">
            <p className="text-gray-200 font-medium">
              Hello, <span className="text-yellow-400 font-semibold">{user.user_metadata?.name || user.email}</span>
            </p>
          </div>
          
          {/* Bottom row - Navigation buttons */}
          <div className="w-full flex justify-center space-x-4">
            <Link 
              to="/my-tasks" 
              className="font-semibold text-lg py-2 px-6 rounded-xl transition-all duration-300 shadow-lg bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black flex items-center justify-center hover:-translate-y-0.5"
            >
              <History className="mr-2 h-5 w-5" />
              My Goals
            </Link>
            
            <Link 
              to="/leaderboard" 
              className="font-semibold text-lg py-2 px-6 rounded-xl transition-all duration-300 shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black flex items-center justify-center hover:-translate-y-0.5"
            >
              <Award className="mr-2 h-5 w-5" />
              Leaderboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;