import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);  // Add this line

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
      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            username: formData.username
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!data || !data.user) {
        throw new Error('No user data returned');
      }

      const userStatsData = {
        userid: data.user.id,
        username: formData.username,
        useremail: formData.email,
        financialliteracy: 0,
        budgetingskill: 0,
        savingshabit: 0,
        investmentknowledge: 0
      };

      const { error: statsError } = await supabase
        .from('user_stats')
        .insert([userStatsData]);

      if (statsError) {
        console.error('Stats Error:', statsError);
        throw statsError;
      }

      setSuccess(true);
      alert('Please check your email to confirm your registration');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="w-full max-w-md bg-gray-800/80 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">Create Account</h2>
          {error && (
            <div className="mb-6 p-4 bg-red-900/40 border border-red-700 rounded-lg text-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-900/40 border border-green-700 rounded-lg text-green-200">
              Account created successfully! Please check your email.
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
              <label className="block text-gray-300 mb-3 text-lg" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          <div className="mt-6 text-center text-gray-400">
            <span>Already have an account? </span>
            <Link to="/signin" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors duration-300">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;