function MetricCard({ title, value, status, score, icon, details, darkMode }) {
  const getScoreColor = (score) => {
    if (score >= 80) return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500' }
    if (score >= 60) return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', bar: 'bg-yellow-500' }
    return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', bar: 'bg-red-500' }
  }

  const colors = getScoreColor(score)

  return (
    <div className={`p-6 rounded-2xl card-hover ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} border shadow-lg`}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
          {score}/100
        </span>
      </div>
      
      <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</h3>
      <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      <p className={`text-sm mt-1 ${colors.text}`}>{status}</p>
      
      {/* Progress bar */}
      <div className={`mt-4 h-2 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${colors.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
      
      {/* Details */}
      {details && details.length > 0 && (
        <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-100'} space-y-2`}>
          {details.map((detail, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{detail.label}</span>
              <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{detail.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MetricCard
