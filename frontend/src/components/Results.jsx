import { useState } from 'react'
import ScoreRing from './ScoreRing'
import MetricCard from './MetricCard'
import RecommendationCard from './RecommendationCard'

function Results({ data, onReset, darkMode }) {
  const { overallScore, healthGrade, metabolicAge, chronologicalAge, metrics, advancedMetrics, recommendations, urgentAlerts } = data
  const [activeTab, setActiveTab] = useState('overview')

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-emerald-500'
    if (grade.startsWith('B')) return 'text-blue-500'
    if (grade.startsWith('C')) return 'text-yellow-500'
    if (grade.startsWith('D')) return 'text-orange-500'
    return 'text-red-500'
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'metrics', label: 'Detailed Metrics', icon: '📈' },
    { id: 'recommendations', label: 'Recommendations', icon: '💡' },
  ]

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Urgent Alerts */}
      {urgentAlerts && urgentAlerts.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-6 animate-slideDown">
          <div className="flex items-start">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">Important Health Alerts</h3>
              <ul className="space-y-1">
                {urgentAlerts.map((alert, i) => (
                  <li key={i} className="text-red-700 dark:text-red-400">{alert}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Score Card */}
      <div className={`rounded-3xl shadow-xl overflow-hidden ${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-white to-gray-50'}`}>
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Score Ring */}
            <div className="flex flex-col items-center">
              <ScoreRing score={overallScore} size={200} darkMode={darkMode} />
              <div className="mt-4 text-center">
                <span className={`text-5xl font-bold ${getGradeColor(healthGrade)}`}>{healthGrade}</span>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Health Grade</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-2xl text-center ${darkMode ? 'bg-slate-700/50' : 'bg-emerald-50'}`}>
                <div className="text-3xl font-bold text-emerald-500">{metrics.bmi.value}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>BMI</div>
                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{metrics.bmi.category}</div>
              </div>
              
              <div className={`p-4 rounded-2xl text-center ${darkMode ? 'bg-slate-700/50' : 'bg-blue-50'}`}>
                <div className="text-3xl font-bold text-blue-500">{metabolicAge}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Metabolic Age</div>
                <div className={`text-xs mt-1 ${metabolicAge < chronologicalAge ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {metabolicAge < chronologicalAge ? `${chronologicalAge - metabolicAge} years younger` : metabolicAge > chronologicalAge ? `${metabolicAge - chronologicalAge} years older` : 'Same as actual'}
                </div>
              </div>
              
              <div className={`p-4 rounded-2xl text-center ${darkMode ? 'bg-slate-700/50' : 'bg-purple-50'}`}>
                <div className="text-3xl font-bold text-purple-500">{advancedMetrics.tdee}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Daily Calories</div>
                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>TDEE</div>
              </div>
              
              <div className={`p-4 rounded-2xl text-center ${darkMode ? 'bg-slate-700/50' : 'bg-orange-50'}`}>
                <div className="text-3xl font-bold text-orange-500">{advancedMetrics.bodyFatEstimate}%</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Est. Body Fat</div>
                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Approximate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`border-t ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-fit px-6 py-4 font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? darkMode 
                      ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-400' 
                      : 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-500'
                    : darkMode
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              title="Body Mass Index"
              value={metrics.bmi.value}
              status={metrics.bmi.category}
              score={metrics.bmi.score}
              icon="⚖️"
              details={[
                { label: 'Risk Level', value: metrics.bmi.risk },
                { label: 'Ideal Range', value: metrics.bmi.idealRange },
              ]}
              darkMode={darkMode}
            />
            <MetricCard
              title="Heart Rate"
              value={`${metrics.heartRate.value} bpm`}
              status={metrics.heartRate.status}
              score={metrics.heartRate.score}
              icon="💓"
              details={[
                { label: 'Zone', value: metrics.heartRate.zone },
                { label: 'Target Zone', value: metrics.heartRate.targetZone },
              ]}
              darkMode={darkMode}
            />
            <MetricCard
              title="Sleep Quality"
              value={`${metrics.sleep.value} hrs`}
              status={metrics.sleep.status}
              score={metrics.sleep.score}
              icon="😴"
              details={[
                { label: 'Quality', value: metrics.sleep.quality },
                { label: 'Recommended', value: metrics.sleep.recommended },
              ]}
              darkMode={darkMode}
            />
            <MetricCard
              title="Physical Activity"
              value={`${metrics.exercise.weeklyTotal} min/wk`}
              status={metrics.exercise.status}
              score={metrics.exercise.score}
              icon="🏃"
              details={[
                { label: 'Activity Level', value: metrics.exercise.level },
                { label: 'Recommended', value: metrics.exercise.recommended },
              ]}
              darkMode={darkMode}
            />
            <MetricCard
              title="Hydration"
              value={`${metrics.water.value}/${metrics.water.recommended} glasses`}
              status={metrics.water.status}
              score={metrics.water.score}
              icon="💧"
              details={[
                { label: 'Hydration Level', value: `${metrics.water.percentage}%` },
                { label: 'Daily Goal', value: `${metrics.water.recommended} glasses` },
              ]}
              darkMode={darkMode}
            />
            <MetricCard
              title="Stress Level"
              value={metrics.stress.level}
              status={`Score: ${metrics.stress.score}`}
              score={100 - metrics.stress.score}
              icon="🧠"
              details={[
                { label: 'Assessment', value: metrics.stress.level },
              ]}
              darkMode={darkMode}
            />
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-6">
            {/* Advanced Metrics Grid */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                📊 Advanced Health Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{advancedMetrics.bmr}</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Basal Metabolic Rate</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>calories/day</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{advancedMetrics.tdee}</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Daily Energy</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>calories/day</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{advancedMetrics.idealWeight.target} kg</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ideal Weight</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{advancedMetrics.idealWeight.min}-{advancedMetrics.idealWeight.max} kg range</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metrics.heartRate.maxHR}</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Max Heart Rate</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>bpm</div>
                </div>
              </div>
            </div>

            {/* Calorie Goals */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                🎯 Calorie Goals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{advancedMetrics.caloriesForWeightLoss}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Weight Loss</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>-500 cal deficit</div>
                  </div>
                </div>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-emerald-900/30' : 'bg-emerald-50'}`}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-500">{advancedMetrics.tdee}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Maintenance</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>current TDEE</div>
                  </div>
                </div>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{advancedMetrics.caloriesForWeightGain}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Weight Gain</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>+500 cal surplus</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Blood Pressure (if available) */}
            {metrics.bloodPressure.systolic && (
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
                <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ❤️ Blood Pressure Analysis
                </h3>
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {metrics.bloodPressure.systolic}/{metrics.bloodPressure.diastolic}
                    </div>
                    <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>mmHg</div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl ${
                    metrics.bloodPressure.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                    metrics.bloodPressure.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {metrics.bloodPressure.category}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <RecommendationCard
                  key={index}
                  recommendation={rec}
                  index={index}
                  darkMode={darkMode}
                />
              ))
            ) : (
              <div className={`p-8 rounded-2xl text-center ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <span className="text-6xl mb-4 block">🎉</span>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Excellent Health!
                </h3>
                <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your health metrics are looking great. Keep up the good work!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reset Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={onReset}
          className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
            darkMode 
              ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Start New Analysis
        </button>
      </div>
    </div>
  )
}

export default Results
