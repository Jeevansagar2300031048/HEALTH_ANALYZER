import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import HealthForm from './components/HealthForm'
import Results from './components/Results'
import HealthTip from './components/HealthTip'
import Footer from './components/Footer'
import HealthBot from './components/HealthBot'

function App() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [lastHealthData, setLastHealthData] = useState(null)

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const analyzeHealth = async (formData) => {
    setLoading(true)
    setError(null)
    setLastHealthData(formData)
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to analyze health data')
      }
      
      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetAnalysis = () => {
    setResults(null)
    setError(null)
  }

  const handleGetStarted = () => {
    setShowForm(true)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-slate-900' : 'bg-gradient-to-br from-emerald-50 via-white to-indigo-50'}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showForm && !results ? (
          <Hero onGetStarted={handleGetStarted} darkMode={darkMode} />
        ) : !results ? (
          <div className="animate-fadeIn">
            <div className="text-center mb-10">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Complete Health Assessment
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Enter your health metrics to receive a comprehensive analysis with personalized insights and recommendations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <HealthForm onSubmit={analyzeHealth} loading={loading} darkMode={darkMode} />
                
                {error && (
                  <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-center animate-slideUp">
                    <span className="mr-2">⚠️</span>{error}
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <HealthTip darkMode={darkMode} />
                
                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} border shadow-lg`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    🔒 Your Privacy Matters
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your health data is processed locally and never stored permanently. We prioritize your privacy and security.
                  </p>
                </div>
                
                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-800' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100'} border`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ✨ Pro Features
                  </h3>
                  <ul className={`text-sm space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>• Metabolic age calculation</li>
                    <li>• TDEE & BMR analysis</li>
                    <li>• Stress level estimation</li>
                    <li>• Heart rate zones</li>
                    <li>• Personalized recommendations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Results data={results} onReset={resetAnalysis} darkMode={darkMode} />
        )}
      </main>
      
      <Footer darkMode={darkMode} />
      
      {/* AI Health Chatbot */}
      <HealthBot darkMode={darkMode} healthData={lastHealthData} />
    </div>
  )
}

export default App
