function RecommendationCard({ recommendation, index, darkMode }) {
  const { category, priority, title, description, actionItems } = recommendation

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return { 
          bg: darkMode ? 'bg-red-900/30' : 'bg-red-50', 
          border: 'border-red-200 dark:border-red-800',
          badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
          icon: '🔴'
        }
      case 'medium':
        return { 
          bg: darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50', 
          border: 'border-yellow-200 dark:border-yellow-800',
          badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400',
          icon: '🟡'
        }
      default:
        return { 
          bg: darkMode ? 'bg-blue-900/30' : 'bg-blue-50', 
          border: 'border-blue-200 dark:border-blue-800',
          badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
          icon: '🔵'
        }
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Weight': '⚖️',
      'Cardiovascular': '❤️',
      'Sleep': '😴',
      'Fitness': '💪',
      'Hydration': '💧',
      'Mental Health': '🧠',
      'Lifestyle': '🌟'
    }
    return icons[category] || '💡'
  }

  const colors = getPriorityColor(priority)

  return (
    <div 
      className={`rounded-2xl border overflow-hidden animate-slideUp ${colors.bg} ${colors.border}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getCategoryIcon(category)}</span>
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{category}</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
            {colors.icon} {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
          </span>
        </div>
        
        <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
        
        {actionItems && actionItems.length > 0 && (
          <div className={`pt-4 border-t ${darkMode ? 'border-slate-700/50' : 'border-gray-200/50'}`}>
            <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Action Items:
            </h4>
            <ul className="space-y-2">
              {actionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecommendationCard
