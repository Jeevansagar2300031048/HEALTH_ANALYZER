import { useState } from 'react'

function HealthForm({ onSubmit, loading, darkMode }) {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    heartRate: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    sleepHours: '',
    exerciseMinutes: '',
    waterIntake: '',
    smokingStatus: 'never',
    alcoholConsumption: 'none',
  })
  
  const [activeSection, setActiveSection] = useState('basic')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const numericFields = ['age', 'weight', 'height', 'heartRate', 'sleepHours', 'exerciseMinutes', 'waterIntake', 'bloodPressureSystolic', 'bloodPressureDiastolic']
    const processedData = { ...formData }
    
    numericFields.forEach(field => {
      if (processedData[field]) {
        processedData[field] = parseFloat(processedData[field])
      }
    })
    
    onSubmit(processedData)
  }

  const sections = {
    basic: {
      title: 'Basic Info',
      icon: '👤',
      fields: [
        { name: 'age', label: 'Age', unit: 'years', type: 'number', placeholder: '30', required: true },
        { name: 'gender', label: 'Gender', type: 'select', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }] },
        { name: 'weight', label: 'Weight', unit: 'kg', type: 'number', placeholder: '70', required: true },
        { name: 'height', label: 'Height', unit: 'cm', type: 'number', placeholder: '175', required: true },
      ]
    },
    vitals: {
      title: 'Vital Signs',
      icon: '💓',
      fields: [
        { name: 'heartRate', label: 'Resting Heart Rate', unit: 'bpm', type: 'number', placeholder: '72', required: true },
        { name: 'bloodPressureSystolic', label: 'Blood Pressure (Systolic)', unit: 'mmHg', type: 'number', placeholder: '120' },
        { name: 'bloodPressureDiastolic', label: 'Blood Pressure (Diastolic)', unit: 'mmHg', type: 'number', placeholder: '80' },
      ]
    },
    lifestyle: {
      title: 'Lifestyle',
      icon: '🏃',
      fields: [
        { name: 'sleepHours', label: 'Average Sleep', unit: 'hours/night', type: 'number', placeholder: '7', required: true },
        { name: 'exerciseMinutes', label: 'Daily Exercise', unit: 'minutes', type: 'number', placeholder: '30', required: true },
        { name: 'waterIntake', label: 'Water Intake', unit: 'glasses/day', type: 'number', placeholder: '8', required: true },
      ]
    },
    habits: {
      title: 'Habits',
      icon: '📋',
      fields: [
        { name: 'smokingStatus', label: 'Smoking Status', type: 'select', options: [{ value: 'never', label: 'Never Smoked' }, { value: 'former', label: 'Former Smoker' }, { value: 'current', label: 'Current Smoker' }] },
        { name: 'alcoholConsumption', label: 'Alcohol Consumption', type: 'select', options: [{ value: 'none', label: 'None' }, { value: 'light', label: 'Light (1-2/week)' }, { value: 'moderate', label: 'Moderate (3-7/week)' }, { value: 'heavy', label: 'Heavy (8+/week)' }] },
      ]
    }
  }

  const renderField = (field) => {
    const baseInputClass = `w-full px-4 py-3.5 rounded-xl transition-all outline-none ${
      darkMode 
        ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20' 
        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 hover:bg-white'
    } border`

    if (field.type === 'select') {
      return (
        <select
          name={field.name}
          value={formData[field.name]}
          onChange={handleChange}
          className={baseInputClass}
        >
          {field.options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )
    }

    return (
      <div className="relative">
        <input
          type={field.type}
          name={field.name}
          value={formData[field.name]}
          onChange={handleChange}
          placeholder={field.placeholder}
          required={field.required}
          min="0"
          step="any"
          className={`${baseInputClass} ${field.unit ? 'pr-16' : ''}`}
        />
        {field.unit && (
          <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {field.unit}
          </span>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`rounded-3xl shadow-xl overflow-hidden ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100'}`}>
      {/* Section Tabs */}
      <div className={`flex overflow-x-auto border-b ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-gray-100 bg-gray-50'}`}>
        {Object.entries(sections).map(([key, section]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveSection(key)}
            className={`flex-1 min-w-fit px-6 py-4 font-medium transition-all flex items-center justify-center gap-2 ${
              activeSection === key
                ? darkMode 
                  ? 'bg-slate-700 text-emerald-400 border-b-2 border-emerald-400' 
                  : 'bg-white text-emerald-600 border-b-2 border-emerald-500'
                : darkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{section.icon}</span>
            <span className="hidden sm:inline">{section.title}</span>
          </button>
        ))}
      </div>

      {/* Form Fields */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {sections[activeSection].fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className={`flex items-center text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>

        {/* Navigation & Submit */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
          <div className="flex gap-2">
            {Object.keys(sections).map((key, index) => (
              <div
                key={key}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeSection === key 
                    ? 'bg-emerald-500 w-6' 
                    : darkMode ? 'bg-slate-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-3">
            {activeSection !== 'basic' && (
              <button
                type="button"
                onClick={() => {
                  const keys = Object.keys(sections)
                  const currentIndex = keys.indexOf(activeSection)
                  setActiveSection(keys[currentIndex - 1])
                }}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  darkMode 
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ← Previous
              </button>
            )}
            
            {activeSection !== 'habits' ? (
              <button
                type="button"
                onClick={() => {
                  const keys = Object.keys(sections)
                  const currentIndex = keys.indexOf(activeSection)
                  setActiveSection(keys[currentIndex + 1])
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all"
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-emerald-500/25 flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze My Health
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}

export default HealthForm
