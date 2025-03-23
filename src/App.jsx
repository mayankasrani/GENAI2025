import { useState, useRef } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import './App.css'

import { Sparkles, Clock, DollarSign, AlertCircle, Send, Upload, Image as ImageIcon, X } from 'lucide-react'
import { UserProvider } from './context/UserContext';
import SignUp from './components/SignUp';
import { Link } from 'react-router-dom';
import Header from './components/header'
import { useEffect } from 'react'

function App() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toast, setToast] = useState({ title: '', message: '', type: '' })
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [hasSubmittedQuery, setHasSubmittedQuery] = useState(false) // Track if user has submitted a query
  const [lastQuery, setLastQuery] = useState('') // Store the last query for verification
  const [isPositiveDecision, setIsPositiveDecision] = useState(false) // Track if decision is positive
  const fileInputRef = useRef(null)

  const showToastMessage = (title, message, type) => 
  {
    setToast({ title, message, type })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      showToastMessage('Invalid file', 'Please upload an image file', 'error')
      return
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToastMessage('File too large', 'Please upload an image smaller than 5MB', 'error')
      return
    }

    setSelectedImage(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const [isPositiveIdea, setIsPositiveIdea] = useState(null); // New state to track idea positivity

  const handleSubmit = async () => {
    if (!input.trim()) {
      showToastMessage('Input required', 'Please enter a decision to analyze', 'error');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/analyze', { query: input });

      if (res.data.analysis) {
        setResponse(res.data.analysis);
        setIsPositiveIdea(res.data.isPositive); // Set the boolean value
        showToastMessage('Analysis complete', 'Your request has been analyzed', 'success');
      } else {
        throw new Error('No analysis received');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to analyze your request. Please try again.');
      showToastMessage('Something went wrong', 'Failed to analyze your request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    "I want to drink bubble tea every day for a year.",
    "I am going to go to the gym three times a week.",
    "Should I subscribe to 4 streaming services?",
    "Is it a problem if I only eat instant ramen noodles?"
  ];

  const handleButtonClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = handleImageUpload;
    fileInput.click();
  };

  const handleImageVerification = async () => {
    if (!selectedImage) {
        showToastMessage('Image required', 'Please upload an image to verify', 'error');
        return;
    }

    setLoading(true);
    setError('');

    try {
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result;
            const res = await axios.post('http://localhost:5000/analyze-image', {
                image: base64Image,
                prompt: `Verify the activity: "${lastQuery}"`
            });

            if (res.data.analysis) {
                setResponse(res.data.analysis);
                showToastMessage('Verification complete', 'Your image has been verified', 'success');
            } else {
                throw new Error('No analysis received');
            }
        };
        reader.readAsDataURL(selectedImage);
    } catch (err) {
        console.error('Error:', err);
        setError('Failed to verify your image. Please try again.');
        showToastMessage('Something went wrong', 'Failed to verify your image', 'error');
    } finally {
        setLoading(false);
    }
  };

  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative">
        <Header />
        <div className="absolute top-4 right-4 z-50 flex gap-4">
        </div>

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
                    Analyze the cost of your choices - whats the price to pay, or how much could you gain?
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

              {/* Always show examples */}
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

              {/* Conditionally render image upload section based on isPositiveIdea */}
              {isPositiveIdea === 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Upload an image to verify if you're doing this activity</label>
                  <div className="flex items-center gap-4">
                    
                    <button
                      onClick={handleButtonClick}
                      className="px-6 py-4 bg-gray-800/60 border border-gray-600 hover:bg-gray-700 text-gray-300 rounded-md transition-colors flex items-center gap-3"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Verification Image
                    </button>
                    {imagePreview && (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="h-16 w-16 object-cover rounded-md border border-gray-600" 
                        />
                        <button 
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  {imagePreview && (
                    <p className="text-xs text-gray-400">
                      This image will be used to verify if you're doing the activity: "{lastQuery}"
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-700">
              <button
                className="w-full font-semibold text-lg py-4 px-6 rounded-xl transition-all duration-300 shadow-lg bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black flex items-center justify-center"
                onClick={isPositiveIdea === 1 ? handleImageVerification : handleSubmit}
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
                {loading ? 'Processing, Please Wait...' : isPositiveIdea === 1 ? 'Verify Activity' : 'Analyze Decision'}
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
