import { useState, useRef, useEffect } from 'react'

function HealthBot({ darkMode, healthData }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(true)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I'm HealthBot, your personal health assistant. I'm here to help you with nutrition advice, exercise tips, sleep optimization, stress management, and more!\n\nHow can I help you today?"
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Hide tooltip after 10 seconds or when chat is opened
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 10000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isOpen) setShowTooltip(false)
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = async (e) => {
    e?.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId,
          healthContext: healthData
        })
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. 🔄" 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = async () => {
    try {
      await fetch(`/api/chat/${sessionId}`, { method: 'DELETE' })
    } catch (e) {}
    setMessages([{
      role: 'assistant',
      content: "👋 Chat cleared! How can I help you with your health journey today?"
    }])
  }

  const quickPrompts = [
    "How can I sleep better?",
    "Quick healthy breakfast ideas",
    "5-minute stress relief tips",
    "How much water should I drink?"
  ]

  return (
    <>
      {/* Attention-grabbing tooltip */}
      {showTooltip && !isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-bounce">
          <div className={`relative px-4 py-3 rounded-2xl shadow-2xl max-w-xs ${
            darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <p className="font-semibold text-sm">Need Health Advice?</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Chat with HealthBot AI!</p>
              </div>
            </div>
            {/* Arrow pointing to button */}
            <div className={`absolute -bottom-2 right-8 w-4 h-4 rotate-45 ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}></div>
          </div>
        </div>
      )}

      {/* Glowing ring effect */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full">
          <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30"></div>
          <div className="absolute inset-0 rounded-full bg-emerald-400 animate-pulse opacity-20" style={{ animationDelay: '0.5s' }}></div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 animate-gradient'
        }`}
        style={!isOpen ? { 
          boxShadow: '0 0 30px rgba(16, 185, 129, 0.6), 0 0 60px rgba(16, 185, 129, 0.4), 0 10px 40px rgba(0,0,0,0.3)'
        } : {}}
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <span className="text-3xl">🤖</span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center">
                <span className="text-white text-[8px] font-bold">AI</span>
              </span>
            </span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl overflow-hidden animate-scaleIn ${
          darkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-bold text-white">HealthBot</h3>
                  <p className="text-xs text-emerald-100">Your AI Health Assistant</p>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Clear chat"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={`h-80 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-md'
                      : darkMode
                        ? 'bg-slate-700 text-gray-200 rounded-bl-md'
                        : 'bg-white text-gray-800 shadow-md rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className={`rounded-2xl px-4 py-3 rounded-bl-md ${darkMode ? 'bg-slate-700' : 'bg-white shadow-md'}`}>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className={`px-4 py-2 border-t ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-100 bg-gray-50'}`}>
              <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputMessage(prompt)
                      setTimeout(() => inputRef.current?.focus(), 0)
                    }}
                    className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                      darkMode 
                        ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={sendMessage} className={`p-4 border-t ${darkMode ? 'border-slate-700 bg-slate-900' : 'border-gray-100 bg-white'}`}>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about health, nutrition, exercise..."
                disabled={isLoading}
                className={`flex-1 px-4 py-3 rounded-xl outline-none transition-all ${
                  darkMode 
                    ? 'bg-slate-800 text-white placeholder-gray-400 border border-slate-700 focus:border-emerald-500' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-200 focus:border-emerald-500'
                }`}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className={`text-xs mt-2 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              ⚠️ Not medical advice. Consult a doctor for health concerns.
            </p>
          </form>
        </div>
      )}
    </>
  )
}

export default HealthBot
