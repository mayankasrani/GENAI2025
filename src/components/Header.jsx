import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, History, Award, LogOut } from 'lucide-react';
import UserContext from "../context/UserContext";
import { supabase } from "../services/supabaseClient";

const Header = () => {
  // Get user information from context
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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
  <div className="center">
    <p className="text-gray-200 font-medium">
      Hello, <span className="text-yellow-400 font-semibold">{user.user_metadata?.name || user.email}</span>
    </p>
  </div>

  {/* Bottom row - Identical Buttons with Proper Spacing */}
  <div className="w-full flex justify-center gap-6">
    <Link 
      to="/leaderboard" 
      className="font-semibold text-lg py-3 px-6 rounded-xl transition-all duration-300 shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black flex items-center justify-center hover:-translate-y-0.5 min-w-[160px]"
    >
      <Award className="h-5 w-5 mr-2" />
      <span>Leaderboard</span>
    </Link>
        <p className="size-sm">&#8203;  &#8203; &#8203; &#8203; &#8203; &#8203;</p>
    <button 
      onClick={handleLogout}
      className="font-semibold text-lg py-3 px-6 rounded-xl transition-all duration-300 shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black flex items-center justify-center hover:-translate-y-0.5 min-w-[160px] border-transparent"
    >
      <LogOut className="h-5 w-5 mr-2" />
      <span>Logout</span>
    </button>
  </div>
</div>
      )}
    </div>
  );
};

export default Header;