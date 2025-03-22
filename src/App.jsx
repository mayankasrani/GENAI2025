import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import "./App.css"
import {
  Sparkles,
  Clock,
  DollarSign,
  AlertCircle,
  Send,
  Brain,
  Coins,
  Calendar,
  TrendingUp,
  BarChart4,
  PiggyBank,
  Lightbulb,
} from "lucide-react"
import Particles from "./components/Particles"
import { TypeAnimation } from "react-type-animation"
import confetti from "canvas-confetti"

function App() {
  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toast, setToast] = useState({ title: "", message: "", type: "" })
  const [showIntro, setShowIntro] = useState(true)
  const [analysisStarted, setAnalysisStarted] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [metrics, setMetrics] = useState(null)
  const [activeTab, setActiveTab] = useState("summary")

  const resultRef = useRef(null)
  const canvasRef = useRef(null)

  // Simulate metrics calculation based on the response
  const calculateMetrics = (text) => {
    // In a real app, this would be calculated from the AI response
    return {
      financialImpact: Math.floor(Math.random() * 100),
      timeImpact: Math.floor(Math.random() * 100),
      healthImpact: Math.floor(Math.random() * 100),
      overallScore: Math.floor(Math.random() * 100),
    }
  }

  useEffect(() => {
    // Auto-hide intro after 3 seconds
    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (analysisComplete && resultRef.current) {
      // Scroll to results
      resultRef.current.scrollIntoView({ behavior: "smooth" })

      // Trigger confetti when analysis is complete
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Use confetti
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)
    }
  }, [analysisComplete])

  const showToastMessage = (title, message, type) => {
    setToast({ title, message, type })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleSubmit = async () => {
    if (!input.trim()) {
      showToastMessage("Input required", "Please enter a decision to analyze", "error")
      return
    }

    setLoading(true)
    setError("")
    setAnalysisStarted(true)
    setAnalysisComplete(false)

    try {
      // Simulate AI thinking with a delay
      await new Promise((resolve) => setTimeout(resolve, 2500))

      const res = await axios.post("http://localhost:5000/analyze", { text: input })
      setResponse(res.data.result)

      // Calculate metrics based on the response
      setMetrics(calculateMetrics(res.data.result))

      showToastMessage("Analysis complete", "Your decision has been analyzed", "success")
      setAnalysisComplete(true)
    } catch (err) {
      setError("Failed to analyze your decision. Please try again.")
      showToastMessage("Something went wrong", "Failed to analyze your decision", "error")
      setAnalysisStarted(false)
    } finally {
      setLoading(false)
    }
  }

  const examples = [
    "I want to drink bubble tea every day for a year.",
    "I'm considering buying a $1000 gaming console.",
    "Should I subscribe to 5 streaming services?",
    "What if I quit my job to travel for 6 months?",
  ]

  const renderGauge = (value, label, icon) => {
    const angle = (value / 100) * 180

    return (
      <div className="gauge-container">
        <div className="gauge">
          <div className="gauge-body">
            <div className="gauge-fill" style={{ transform: `rotate(${angle}deg)` }}></div>
            <div className="gauge-cover">
              <div className="gauge-value">{value}</div>
              <div className="gauge-label">{label}</div>
              {icon}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <Particles />

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`toast ${toast.type === "error" ? "toast-error" : "toast-success"}`}
          >
            <div className="toast-content">
              <div className={`toast-icon ${toast.type === "error" ? "toast-icon-error" : "toast-icon-success"}`}>
                {toast.type === "error" ? <AlertCircle className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
              </div>
              <div className="toast-message">
                <p className="toast-title">{toast.title}</p>
                <p className="toast-description">{toast.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIntro && (
          <motion.div className="intro-overlay" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="intro-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="intro-icon"
              >
                <Brain className="h-16 w-16 text-yellow-400" />
              </motion.div>
              <h1 className="intro-title">LifeCost AI</h1>
              <p className="intro-subtitle">Analyzing the true cost of your decisions</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="main-container"
      >
        <div className="card main-card">
          <div className="card-header">
            <div className="logo-container">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="logo-icon"
              >
                <Brain className="h-8 w-8 text-yellow-400" />
              </motion.div>
              <div>
                <h1 className="app-title">LifeCost AI</h1>
                <p className="app-subtitle">Analyze the true cost of your life decisions</p>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="input-group">
              <label className="input-label">
                <Lightbulb className="h-4 w-4 mr-2" />
                Enter your decision
              </label>
              <textarea
                className="input-textarea"
                placeholder="E.g. I want to drink bubble tea every day for a year."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <div className="examples-container">
              <p className="examples-label">
                <Sparkles className="h-4 w-4 mr-2" />
                Or try one of these examples:
              </p>
              <div className="examples-buttons">
                {examples.map((example, index) => (
                  <button key={index} className="example-button" onClick={() => setInput(example)}>
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card-footer">
            <motion.button
              className="submit-button"
              onClick={handleSubmit}
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="button-icon"
                >
                  <Clock className="h-5 w-5" />
                </motion.div>
              ) : (
                <Send className="button-icon h-5 w-5" />
              )}
              {loading ? "Analyzing..." : "Analyze Decision"}
            </motion.button>

            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="error-message">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p>{error}</p>
              </motion.div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {analysisStarted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="analysis-container"
              ref={resultRef}
            >
              <div className="card analysis-card">
                <div className="card-header analysis-header">
                  <h2 className="analysis-title">
                    <DollarSign className="h-5 w-5" />
                    Analysis Results
                  </h2>
                </div>

                {!analysisComplete ? (
                  <div className="analysis-loading">
                    <div className="brain-container">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        className="brain-pulse"
                      >
                        <Brain className="brain-icon" />
                      </motion.div>
                      <div className="brain-waves">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="brain-wave"
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [1, 1.5, 1],
                              x: [0, 100, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.2,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="loading-text">
                      <TypeAnimation
                        sequence={[
                          "Analyzing your decision...",
                          1000,
                          "Calculating financial impact...",
                          1000,
                          "Evaluating time costs...",
                          1000,
                          "Considering health factors...",
                          1000,
                          "Generating insights...",
                          1000,
                        ]}
                        repeat={Number.POSITIVE_INFINITY}
                      />
                    </p>
                  </div>
                ) : (
                  <div className="analysis-content">
                    <div className="decision-summary">
                      <p className="decision-label">Your decision:</p>
                      <p className="decision-text">"{input}"</p>
                    </div>

                    <div className="tabs">
                      <button
                        className={`tab ${activeTab === "summary" ? "active-tab" : ""}`}
                        onClick={() => setActiveTab("summary")}
                      >
                        <BarChart4 className="h-4 w-4 mr-2" />
                        Summary
                      </button>
                      <button
                        className={`tab ${activeTab === "metrics" ? "active-tab" : ""}`}
                        onClick={() => setActiveTab("metrics")}
                      >
                        <PiggyBank className="h-4 w-4 mr-2" />
                        Metrics
                      </button>
                    </div>

                    <div className="tab-content">
                      {activeTab === "summary" ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="summary-content">
                          <h3 className="content-title">Impact Analysis:</h3>
                          <p className="content-text">{response}</p>
                        </motion.div>
                      ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="metrics-content">
                          <div className="metrics-grid">
                            {renderGauge(metrics.financialImpact, "Financial", <Coins className="gauge-icon" />)}
                            {renderGauge(metrics.timeImpact, "Time", <Calendar className="gauge-icon" />)}
                            {renderGauge(metrics.healthImpact, "Health", <TrendingUp className="gauge-icon" />)}
                            {renderGauge(metrics.overallScore, "Overall", <BarChart4 className="gauge-icon" />)}
                          </div>

                          <div className="metrics-summary">
                            <h3 className="metrics-title">Decision Score: {metrics.overallScore}/100</h3>
                            <p className="metrics-description">
                              {metrics.overallScore > 70
                                ? "This decision appears to be beneficial overall."
                                : metrics.overallScore > 40
                                  ? "This decision has mixed implications."
                                  : "This decision may have significant negative impacts."}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} LifeCost AI • Analyze smarter, live better</p>
      </footer>

      <canvas ref={canvasRef} className="confetti-canvas"></canvas>
    </div>
  )
}

export default App
