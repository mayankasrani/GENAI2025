import React from "react";
import { Link } from "react-router-dom"; // Add this import
import { Sparkles} from 'lucide-react'


const Header = () => {
  return (
    <div className="relative w-full p-4">
      <div className="absolute top-4 flex space-x-4 justify-center items-center left-1/2 transform -translate-x-1/2">
        <Link 
          to="/signin" 
          className="font-semibold text-lg py-2 px-3 rounded-xl transition-all duration-300 shadow-lg bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-400 hover:to-amber-400 text-black flex items-center justify-center hover:-translate-y-0.5"
        >
          Sign In
        </Link>
        <p className="px-3 text-gray-300" >or</p>
        <Link 
          to="/signup" 
          className="font-semibold text-lg py-2 px-3 rounded-xl transition-all duration-300 shadow-lg bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-black flex items-center justify-center hover:-translate-y-0.5"
        >
          Sign Up
        </Link>

        <p className="px-3 text-gray-300"> to receive personalized insights</p>
      </div>
    </div>
  );
};
        //   <button className=" hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded-lg transition">
        //   <button className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded-lg transition">
  

export default Header;