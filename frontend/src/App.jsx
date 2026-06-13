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
  const [currentView, setCurrentView] = useState('home') // 'home', 'features', 'about'

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

  // Reset to form view when features/about clicked
  useEffect(() => {
    if (currentView !== 'home') {
      setShowForm(false)
      setResults(null)
    }
  }, [currentView])

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
      setCurrentView('home')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetAnalysis = () => {
    setResults(null)
    setError(null)
    setShowForm(false)
  }

  const handleGetStarted = () => {
    setShowForm(true)
    setCurrentView('home')
  }

  const handleNavigate = (view) => {
    setCurrentView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // About section component
  const AboutSection = () => (
    <div className="py-12 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-4">
            <span className="mr-2">ℹ️</span> About HealthAnalyzer
          </div>
          <h2 className={`text-4xl md:text-5xl font-extrabold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Revolutionizing <span className="text-gradient">Personal Health</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            HealthAnalyzer is an advanced health analytics platform that uses cutting-edge algorithms 
            to provide you with comprehensive insights into your wellbeing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} border shadow-lg`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>🎯 Our Mission</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              To empower individuals with actionable health insights, making advanced health analytics 
              accessible to everyone. We believe knowledge is the first step toward better health.
            </p>
          </div>
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} border shadow-lg`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>🔬 How It Works</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Enter your health metrics — age, weight, heart rate, sleep, exercise, and more. 
              Our algorithms calculate BMI, metabolic age, BMR, TDEE, stress levels, and provide 
              personalized recommendations powered by AI.
            </p>
          </div>
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} border shadow-lg`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>🤖 AI Health Assistant</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Our HealthBot AI assistant provides personalized health advice, answers your questions 
              about nutrition, exercise, sleep, and wellness — all powered by Groq's advanced AI.
            </p>
          </div>
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} border shadow-lg`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>🔒 Privacy First</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your health data stays between you and the analysis engine. We don't store personal 
              information or share your data with third parties. Your privacy is our priority.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMainContent = () => {
    if (currentView === 'about') {
      return <AboutSection />
    }

    if (currentView === 'features') {
      return (
        <div className="py-12 animate-fadeIn">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-4">
              <span className="mr-2">✨</span> Features
            </div>
            <h2 className={`text-4xl md:text-5xl font-extrabold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Comprehensive <span className="text-gradient">Health Analysis</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`p-8 rounded-2xl text-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} border shadow-lg`}>
              <span className="text-6xl mb-6 block">📊</span>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>BMI Analysis</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Comprehensive body mass index calculation with category classification (underweight to obese), risk assessment, and ideal weight range comparison.
              </p>
            </div>
            <div className={`p-8 rounded-2xl text-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} border shadow-lg`}>
              <span className="text-6xl mb-6 block">💓</span>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Heart Health</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Resting heart rate analysis with zone classification (athletic, excellent, good, elevated). Get target heart rate zones for optimal cardio training.
              </p>
            </div>
            <div className={`p-8 rounded-2xl text-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} border shadow-lg`}>
              <span className="text-6xl mb-6 block">🧠</span>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Metabolic Age</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Calculate whether your body is biologically younger or older than your chronological age based on BMI, exercise habits, and sleep quality.
              </p>
            </div>
            <div className={`p-8 rounded-2xl text-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} border shadow-lg`}>
              <span className="text-6xl mb-6 block">🔥</span>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Calorie Tracking</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                BMR (Basal Metabolic Rate) and TDEE (Total Daily Energy Expenditure) calculations with customized calorie goals for weight loss, maintenance, or gain.
              </p>
            </div>
            <div className={`p-8 rounded-2xl text-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} border shadow-lg`}>
              <span className="text-6xl mb-6 block">😴</span>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sleep Analysis</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Sleep quality assessment with personalized recommendations to optimize your sleep patterns and improve overall rest and recovery.
              </p>
            </div>
            <div className={`p-8 rounded-2xl text-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} border shadow-lg`}>
              <span className="text-6xl mb-6 block">💡</span>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Smart Recommendations</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                AI-powered personalized health recommendations covering nutrition, exercise, hydration, stress management, and lifestyle improvements.
              </p>
            </div>
          </div>
        </div>
      )
    }

    // Home view
    if (!showForm && !results) {
      return <Hero onGetStarted={handleGetStarted} darkMode={darkMode} />
    }
    if (!results) {
      return (
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
      )
    }
    return <Results data={results} onReset={resetAnalysis} darkMode={darkMode} />
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${darkMode ? 'dark bg-slate-900' : 'bg-gradient-to-br from-emerald-50 via-white to-indigo-50'}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} onNavigate={handleNavigate} currentView={currentView} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {renderMainContent()}
      </main>
      
      <Footer darkMode={darkMode} onNavigate={handleNavigate} />
      
      {/* AI Health Chatbot */}
      <HealthBot darkMode={darkMode} healthData={lastHealthData} />
    </div>
  )
}

export default App