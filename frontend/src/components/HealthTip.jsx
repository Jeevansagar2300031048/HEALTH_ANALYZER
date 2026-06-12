import { useState, useEffect } from 'react'

function HealthTip({ darkMode }) {
  const [tip, setTip] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchTip = async () => {
    setLoading(true)
    try {
      // Try AI-powered tips first
      const response = await fetch('/api/ai-tip')
      const data = await response.json()
      setTip(data)
    } catch (error) {
      // Fallback to regular tips
      try {
        const response = await fetch('/api/tips')
        const data = await response.json()
        setTip(data)
      } catch {
        setTip({ category: 'Health', tip: '💪 Stay active and drink plenty of water!' })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTip()
  }, [])

  const getCategoryEmoji = (category) => {
    const emojis = {
      'Nutrition': '🥗',
      'Exercise': '🏃',
      'Sleep': '😴',
      'Hydration': '💧',
      'Mental Health': '🧘',
      'Posture': '🪑',
      'Heart Health': '❤️',
      'Immunity': '🛡️'
    }
    return emojis[category] || '💡'
  }

  return (
    <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border-emerald-800' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100'} border`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          💡 Daily Health Tip
        </h3>
        <button
          onClick={fetchTip}
          disabled={loading}
          className={`p-2 rounded-lg transition-all ${
            darkMode 
              ? 'hover:bg-emerald-800/50 text-emerald-400' 
              : 'hover:bg-emerald-100 text-emerald-600'
          } ${loading ? 'animate-spin' : ''}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      {tip && (
        <div className="animate-fadeIn">
          <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium mb-2 ${
            darkMode ? 'bg-emerald-800/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {getCategoryEmoji(tip.category)} {tip.category}
          </span>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {tip.tip}
          </p>
        </div>
      )}
    </div>
  )
}

export default HealthTip
