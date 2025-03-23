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

  const handleSubmit = async () => {
    if (!input.trim() && !selectedImage) {
      showToastMessage('Input required', 'Please enter a decision to analyze', 'error')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      let res
      
      if (selectedImage && hasSubmittedQuery) {
        // If we have an image and a previous query, we're verifying activity
        const reader = new FileReader()
        reader.readAsDataURL(selectedImage)
        
        const base64Image = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
        })
        
        // Send image with verification prompt
        res = await axios.post('http://localhost:5000/analyze-image', { 
          image: base64Image,
          prompt: `Based on this image, is the person partaking in the activity they described: "${lastQuery}"? Provide an analysis.`
        })
      } else {
        // Text-only analysis for initial query
        res = await axios.post('http://localhost:5000/analyze', { query: input })
        // Save this query for future verification
        setLastQuery(input)
        // Mark that user has submitted a query
        setHasSubmittedQuery(true)
      }
      
      if (res.data.analysis) {
        setResponse(res.data.analysis)
        showToastMessage('Analysis complete', 'Your request has been analyzed', 'success')
        // Clear image after submission
        if (selectedImage) {
          removeImage()
        }
      } else {
        throw new Error('No analysis received')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to analyze your request. Please try again.')
      showToastMessage('Something went wrong', 'Failed to analyze your request', 'error')
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

  // Add this useEffect right after your state declarations
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get('http://localhost:5000/test')
        console.log('Backend connection successful:', response.data)
      } catch (error) {
        console.error('Backend connection failed:', error)
      }
    }
    testConnection()
  }, [])

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
                    Analyze the true cost of your life decisions
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Remove this duplicate sign in/up section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Enter your decision</label>
                <textarea
                  className="w-full min-h-[120px] p-4 bg-gray-900/60 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="E.g. I want to drink bubble tea every day for a year."
                  value={input}
                  onChange={(e) => setInput(e.target.value)} />
              </div>

              {/* Image Upload Section - Only show after initial query */}
              {hasSubmittedQuery && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Upload an image to verify if you're doing this activity</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="px-4 py-2 bg-gray-800/60 border border-gray-600 hover:bg-gray-700 text-gray-300 rounded-md transition-colors flex items-center gap-2"
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

              {/* Only show examples if no query has been submitted yet */}
              {!hasSubmittedQuery && (
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
              )}
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
                {loading ? 'Analyzing, Please Wait...' : selectedImage ? 'Verify Activity' : 'Analyze Decision'}
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
