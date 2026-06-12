function Hero({ onGetStarted, darkMode }) {
  const features = [
    { icon: '📊', title: 'BMI Analysis', desc: 'Comprehensive body mass index calculation' },
    { icon: '💓', title: 'Heart Health', desc: 'Heart rate zones and cardiovascular metrics' },
    { icon: '🧠', title: 'Metabolic Age', desc: 'Calculate your body\'s metabolic age' },
    { icon: '🔥', title: 'Calorie Needs', desc: 'BMR and TDEE calculations' },
    { icon: '😴', title: 'Sleep Quality', desc: 'Analyze your sleep patterns' },
    { icon: '💡', title: 'Smart Tips', desc: 'Personalized health recommendations' },
  ]

  return (
    <div className="py-12 md:py-20 animate-fadeIn">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-6 animate-bounce-slow">
          <span className="mr-2">✨</span> Advanced Health Analytics Platform
        </div>
        
        <h1 className={`text-4xl md:text-6xl font-extrabold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Your Health,{' '}
          <span className="text-gradient">Quantified</span>
        </h1>
        
        <p className={`text-lg md:text-xl max-w-3xl mx-auto mb-10 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Get comprehensive insights into your health with our advanced analyzer. 
          Track BMI, heart rate, metabolic age, and receive personalized recommendations 
          to improve your wellbeing.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105 shadow-xl shadow-emerald-500/30 flex items-center"
          >
            Get Started Free
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          
          <button className={`px-8 py-4 font-semibold rounded-2xl transition-all flex items-center ${darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg'}`}>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Watch Demo
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 p-8 rounded-3xl ${darkMode ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-sm`}>
        {[
          { value: '10K+', label: 'Health Analyses' },
          { value: '98%', label: 'Accuracy Rate' },
          { value: '50+', label: 'Health Metrics' },
          { value: '4.9★', label: 'User Rating' },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
          </div>
        ))}
      </div>
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index}
            className={`p-6 rounded-2xl border card-hover ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-emerald-500/50' : 'bg-white border-gray-100 hover:border-emerald-300'}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{feature.desc}</p>
          </div>
        ))}
      </div>
      
      {/* Trust Indicators */}
      <div className="mt-16 text-center">
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Trusted by health-conscious individuals worldwide</p>
        <div className="flex items-center justify-center space-x-8 opacity-50">
          <span className={`text-2xl font-bold ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>🏥 HealthCorp</span>
          <span className={`text-2xl font-bold ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>💪 FitLife</span>
          <span className={`text-2xl font-bold ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>🧬 WellnessAI</span>
        </div>
      </div>
    </div>
  )
}

export default Hero
