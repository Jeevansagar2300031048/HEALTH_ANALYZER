import { useEffect, useState } from 'react'

function ScoreRing({ score, size = 150, darkMode }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedScore / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 100)
    return () => clearTimeout(timer)
  }, [score])

  const getColor = () => {
    if (score >= 80) return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' }
    if (score >= 60) return { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' }
    return { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)' }
  }

  const colors = getColor()

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="progress-ring" width={size} height={size}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle */}
        <circle
          className={darkMode ? 'stroke-slate-700' : 'stroke-gray-200'}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        
        {/* Progress circle */}
        <circle
          className="progress-ring-circle"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            filter: 'url(#glow)',
            transition: 'stroke-dashoffset 1s ease-out'
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {Math.round(animatedScore)}
        </span>
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          out of 100
        </span>
      </div>
    </div>
  )
}

export default ScoreRing
