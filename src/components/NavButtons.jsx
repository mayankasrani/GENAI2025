import React from 'react';
import { Link } from 'react-router-dom';

const NavButtons = () => {
  return (
    <div className="fixed top-4 right-4 flex gap-4">
      <Link
        to="/signin"
        className="px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      >
        Log In
      </Link>
      <Link
        to="/signup"
        className="px-6 py-2 rounded-lg border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      >
        Sign Up
      </Link>
    </div>
  );
};

export default NavButtons;