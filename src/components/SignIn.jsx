import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setError('Please verify your email address before signing in. Check your inbox for the confirmation link.');
        } else if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. If you recently signed up, please verify your email first.');
        } else {
          throw error;
        }
        return;
      }

      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="w-full max-w-md bg-gray-800/80 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">Sign In</h2>
          {error && (
            <div className="mb-6 p-4 bg-red-900/40 border border-red-700 rounded-lg text-red-200">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-3 text-lg" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 bg-gray-900/60 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-3 text-lg" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-4 bg-gray-900/60 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-8 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 mt-6"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 text-center text-gray-400">
            <span>Don't have an account? </span>
            <Link to="/signup" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors duration-300">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;