import { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import './App.css'

import { Sparkles, Clock, DollarSign, AlertCircle, Send } from 'lucide-react'
import { UserProvider } from './context/UserContext';
import SignUp from './components/SignUp';
import { Link } from 'react-router-dom';

function App() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toast, setToast] = useState({ title: '', message: '', type: '' })

  const showToastMessage = (title, message, type) => 
  {
    setToast({ title, message, type })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleSubmit = async () => 
  {
    //Checks if field is not empty
    if (!input.trim()) 
    {
      showToastMessage('This field cannot be left blank', 'Please enter a decision to analyze', 'error')
      return
    }
    
    setLoading(true)
    setError('')
    
    try 
    {
      const res = await axios.post('http://localhost:5000/analyze', { text: input })
      setResponse(res.data.result)
      showToastMessage('Analysis complete', 'Your decision has been analyzed', 'success')
    } catch (err) {
      setError('Failed to analyze your decision. Please try again.')
      showToastMessage('Something went wrong', 'Failed to analyze your decision', 'error')
    } finally {
      setLoading(false)
    }
  }

  const examples = [
    "I want to drink bubble tea every day for a year.",
    "I'm considering buying a gaming console for $600.",
    "Should I subscribe to 3 streaming services?",
    "Should I pull an all-nighter to study for my calc test"
  ]

  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative">
        {/* Sign In button in top right corner */}
        <div className="absolute top-4 right-4 z-50">
          <Link 
            to="/signin" 
            className="px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Sign In
          </Link>
        </div>

        {/* Remove SignUp component and continue with main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          <div className="border border-gray-700 bg-gradient-to-tr from-gray-800 to-gray-700 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 pb-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-8 w-8 text-yellow-400" />
                </motion.div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-300">
                    LifeCost AI </h1>
                  <p className="text-gray-300 mt-1">
                    Analyze the true cost of your life decisions
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Enter your decision</label>
                <textarea
                  className="w-full min-h-[120px] p-4 bg-gray-900/60 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="E.g. I want to drink bubble tea every day for a year."
                  value={input}
                  onChange={(e) => setInput(e.target.value)} />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-300">Or try one of these examples:</p>
                <div className="flex flex-wrap gap-2">
                  {examples.map((example, index) => (
                    <button
                      key={index}
                      className="px-3 py-1 text-sm bg-gray-800/60 border border-gray-600 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
                      onClick={() => setInput(example)}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700">
              <button
                className="w-full font-semibold text-lg py-4 px-6 rounded-xl transition-all duration-300 shadow-lg bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black flex items-center justify-center"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Clock className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <Send className="mr-2 h-5 w-5" />
                )}
                {loading ? 'Analyzing, Please Wait...' : 'Analyze Decision'}
              </button>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-900/40 border border-red-700 rounded-lg flex items-center gap-2 text-red-200"
                >
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p>{error}</p>
                </motion.div>
              )}
            </div>
          </div>

          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8"
            >
              <div className="border border-gray-700 bg-gray-900/80 rounded-xl shadow-xl overflow-hidden">
                <div className="p-4 bg-gray-800/60 border-b border-gray-700">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-yellow-400">
                    <DollarSign className="h-5 w-5" />
                    Analysis Results
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800/40 border border-gray-700 rounded-lg">
                      <p className="text-sm font-medium text-gray-400">Your decision:</p>
                      <p className="text-gray-200 italic">"{input}"</p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-yellow-400">Impact Analysis:</h3>
                      <p className="text-lg leading-relaxed text-gray-100 whitespace-pre-line">{response}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} LifeCost AI • Analyze smarter, live better by Ansh Satish, Mayank Asrani and Josh Choong</p>
        </footer>
      </div>
    </UserProvider>
  )
}

export default App
