const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

/**
 * Creates and configures an Express app with all health analyzer routes.
 * Works for both local development (backend/server.js) and Vercel (api/index.js).
 */
function createApp() {
  const app = express();
  const healthHistory = [];
  const chatSessions = new Map();

  // Initialize Groq client from environment (set in Vercel dashboard or local .env)
  let groq = null;
  if (process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  // Middleware
  app.use(cors());
  app.use(express.json());

  // ─── Health Analysis Algorithms ───────────────────────────────────────────────

  const calculateMetabolicAge = (age, bmi, exerciseMinutes, sleepHours) => {
    let metabolicAge = age;
    if (bmi > 25) metabolicAge += (bmi - 25) * 0.5;
    if (bmi < 18.5) metabolicAge += (18.5 - bmi) * 0.3;
    if (exerciseMinutes >= 30) metabolicAge -= 2;
    if (exerciseMinutes >= 60) metabolicAge -= 3;
    if (sleepHours < 6) metabolicAge += 3;
    if (sleepHours >= 7 && sleepHours <= 8) metabolicAge -= 1;
    return Math.max(18, Math.round(metabolicAge));
  };

  const calculateBMR = (weight, height, age, gender) => {
    if (gender === 'male') {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    }
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  };

  const calculateTDEE = (bmr, exerciseMinutes) => {
    let activityMultiplier = 1.2;
    if (exerciseMinutes >= 60) activityMultiplier = 1.725;
    else if (exerciseMinutes >= 45) activityMultiplier = 1.55;
    else if (exerciseMinutes >= 30) activityMultiplier = 1.375;
    return Math.round(bmr * activityMultiplier);
  };

  const calculateIdealWeight = (height, gender) => {
    const heightInches = height / 2.54;
    if (gender === 'male') {
      return Math.round(50 + 2.3 * (heightInches - 60));
    }
    return Math.round(45.5 + 2.3 * (heightInches - 60));
  };

  const calculateBodyFatEstimate = (bmi, age, gender) => {
    const genderFactor = gender === 'male' ? 1 : 0;
    const bodyFat = (1.20 * bmi) + (0.23 * age) - (10.8 * genderFactor) - 5.4;
    return Math.max(5, Math.min(50, Math.round(bodyFat * 10) / 10));
  };

  const calculateHydrationNeeds = (weight, exerciseMinutes) => {
    let baseWater = weight * 35;
    baseWater += exerciseMinutes * 12;
    return Math.round(baseWater / 250);
  };

  const getStressLevel = (sleepHours, exerciseMinutes, heartRate) => {
    let stressScore = 50;
    if (sleepHours < 6) stressScore += 20;
    if (sleepHours > 9) stressScore += 10;
    if (exerciseMinutes < 15) stressScore += 15;
    if (exerciseMinutes >= 30) stressScore -= 20;
    if (heartRate > 90) stressScore += 15;
    if (heartRate < 60) stressScore -= 10;

    stressScore = Math.max(0, Math.min(100, stressScore));

    if (stressScore < 30) return { level: 'Low', score: stressScore, color: 'green' };
    if (stressScore < 60) return { level: 'Moderate', score: stressScore, color: 'yellow' };
    return { level: 'High', score: stressScore, color: 'red' };
  };

  // ─── Core Analysis Function ──────────────────────────────────────────────────

  const analyzeHealth = (data) => {
    const {
      age, weight, height, heartRate, sleepHours, exerciseMinutes,
      waterIntake, gender = 'male', smokingStatus = 'never', alcoholConsumption = 'none',
      bloodPressureSystolic, bloodPressureDiastolic
    } = data;

    const bmi = weight / ((height / 100) ** 2);
    let bmiCategory = '', bmiScore = 0, bmiRisk = '';

    if (bmi < 16) { bmiCategory = 'Severe Underweight'; bmiScore = 30; bmiRisk = 'High'; }
    else if (bmi < 17) { bmiCategory = 'Moderate Underweight'; bmiScore = 50; bmiRisk = 'Moderate'; }
    else if (bmi < 18.5) { bmiCategory = 'Mild Underweight'; bmiScore = 70; bmiRisk = 'Low'; }
    else if (bmi < 25) { bmiCategory = 'Normal'; bmiScore = 100; bmiRisk = 'Very Low'; }
    else if (bmi < 30) { bmiCategory = 'Overweight'; bmiScore = 70; bmiRisk = 'Low'; }
    else if (bmi < 35) { bmiCategory = 'Obese Class I'; bmiScore = 50; bmiRisk = 'Moderate'; }
    else if (bmi < 40) { bmiCategory = 'Obese Class II'; bmiScore = 35; bmiRisk = 'High'; }
    else { bmiCategory = 'Obese Class III'; bmiScore = 20; bmiRisk = 'Very High'; }

    const maxHeartRate = 220 - age;
    let heartRateScore = 0, heartRateStatus = '', heartRateZone = '';

    if (heartRate >= 60 && heartRate <= 100) {
      heartRateScore = 100;
      heartRateStatus = 'Normal';
      if (heartRate < 70) heartRateZone = 'Athletic';
      else if (heartRate < 80) heartRateZone = 'Excellent';
      else heartRateZone = 'Good';
    } else if (heartRate < 60) {
      heartRateScore = heartRate >= 50 ? 85 : 60;
      heartRateStatus = 'Low (Bradycardia)';
      heartRateZone = heartRate >= 50 ? 'Athletic' : 'Consult Doctor';
    } else {
      heartRateScore = heartRate <= 110 ? 70 : 50;
      heartRateStatus = 'High (Tachycardia)';
      heartRateZone = 'Elevated';
    }

    let bpScore = 100, bpCategory = 'Normal', bpRisk = 'Low';
    if (bloodPressureSystolic && bloodPressureDiastolic) {
      if (bloodPressureSystolic >= 180 || bloodPressureDiastolic >= 120) {
        bpScore = 20; bpCategory = 'Hypertensive Crisis'; bpRisk = 'Critical';
      } else if (bloodPressureSystolic >= 140 || bloodPressureDiastolic >= 90) {
        bpScore = 40; bpCategory = 'High Blood Pressure Stage 2'; bpRisk = 'High';
      } else if (bloodPressureSystolic >= 130 || bloodPressureDiastolic >= 80) {
        bpScore = 60; bpCategory = 'High Blood Pressure Stage 1'; bpRisk = 'Moderate';
      } else if (bloodPressureSystolic >= 120) {
        bpScore = 80; bpCategory = 'Elevated'; bpRisk = 'Low-Moderate';
      } else if (bloodPressureSystolic < 90 || bloodPressureDiastolic < 60) {
        bpScore = 70; bpCategory = 'Low Blood Pressure'; bpRisk = 'Low-Moderate';
      }
    }

    let sleepScore = 0, sleepStatus = '', sleepQuality = '';
    if (sleepHours >= 7 && sleepHours <= 9) {
      sleepScore = 100; sleepStatus = 'Optimal'; sleepQuality = 'Excellent';
    } else if (sleepHours >= 6 && sleepHours < 7) {
      sleepScore = 75; sleepStatus = 'Slightly Low'; sleepQuality = 'Good';
    } else if (sleepHours > 9 && sleepHours <= 10) {
      sleepScore = 80; sleepStatus = 'Slightly High'; sleepQuality = 'Good';
    } else if (sleepHours > 10) {
      sleepScore = 60; sleepStatus = 'Excessive'; sleepQuality = 'Fair';
    } else if (sleepHours >= 5) {
      sleepScore = 50; sleepStatus = 'Insufficient'; sleepQuality = 'Poor';
    } else {
      sleepScore = 30; sleepStatus = 'Severely Insufficient'; sleepQuality = 'Very Poor';
    }

    let exerciseScore = 0, exerciseStatus = '', exerciseLevel = '';
    const weeklyExercise = exerciseMinutes * 7;

    if (weeklyExercise >= 300) {
      exerciseScore = 100; exerciseStatus = 'Excellent'; exerciseLevel = 'Very Active';
    } else if (weeklyExercise >= 150) {
      exerciseScore = 85; exerciseStatus = 'Good'; exerciseLevel = 'Active';
    } else if (weeklyExercise >= 75) {
      exerciseScore = 60; exerciseStatus = 'Fair'; exerciseLevel = 'Moderately Active';
    } else if (weeklyExercise >= 30) {
      exerciseScore = 40; exerciseStatus = 'Low'; exerciseLevel = 'Lightly Active';
    } else {
      exerciseScore = 20; exerciseStatus = 'Insufficient'; exerciseLevel = 'Sedentary';
    }

    const recommendedWater = calculateHydrationNeeds(weight, exerciseMinutes);
    let waterScore = 0, waterStatus = '';
    const waterPercentage = (waterIntake / recommendedWater) * 100;

    if (waterPercentage >= 100) { waterScore = 100; waterStatus = 'Optimal'; }
    else if (waterPercentage >= 80) { waterScore = 85; waterStatus = 'Good'; }
    else if (waterPercentage >= 60) { waterScore = 65; waterStatus = 'Fair'; }
    else if (waterPercentage >= 40) { waterScore = 45; waterStatus = 'Low'; }
    else { waterScore = 25; waterStatus = 'Dehydrated'; }

    let lifestyleScore = 100;
    let lifestyleFactors = [];

    if (smokingStatus === 'current') {
      lifestyleScore -= 30;
      lifestyleFactors.push({ factor: 'Smoking', impact: 'High Negative', points: -30 });
    } else if (smokingStatus === 'former') {
      lifestyleScore -= 10;
      lifestyleFactors.push({ factor: 'Former Smoker', impact: 'Moderate Negative', points: -10 });
    }

    if (alcoholConsumption === 'heavy') {
      lifestyleScore -= 25;
      lifestyleFactors.push({ factor: 'Heavy Alcohol', impact: 'High Negative', points: -25 });
    } else if (alcoholConsumption === 'moderate') {
      lifestyleScore -= 10;
      lifestyleFactors.push({ factor: 'Moderate Alcohol', impact: 'Low Negative', points: -10 });
    }

    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, exerciseMinutes);
    const idealWeight = calculateIdealWeight(height, gender);
    const metabolicAge = calculateMetabolicAge(age, bmi, exerciseMinutes, sleepHours);
    const bodyFatEstimate = calculateBodyFatEstimate(bmi, age, gender);
    const stressAnalysis = getStressLevel(sleepHours, exerciseMinutes, heartRate);

    const weights = { bmi: 0.2, heart: 0.15, bp: 0.15, sleep: 0.15, exercise: 0.15, water: 0.1, lifestyle: 0.1 };
    const overallScore = Math.round(
      bmiScore * weights.bmi +
      heartRateScore * weights.heart +
      bpScore * weights.bp +
      sleepScore * weights.sleep +
      exerciseScore * weights.exercise +
      waterScore * weights.water +
      lifestyleScore * weights.lifestyle
    );

    let healthGrade = '';
    if (overallScore >= 90) healthGrade = 'A+';
    else if (overallScore >= 85) healthGrade = 'A';
    else if (overallScore >= 80) healthGrade = 'B+';
    else if (overallScore >= 75) healthGrade = 'B';
    else if (overallScore >= 70) healthGrade = 'C+';
    else if (overallScore >= 65) healthGrade = 'C';
    else if (overallScore >= 60) healthGrade = 'D';
    else healthGrade = 'F';

    const recommendations = [];
    const urgentAlerts = [];

    if (bmi < 18.5) {
      recommendations.push({
        category: 'Weight', priority: 'high', title: 'Increase Caloric Intake',
        description: `Your BMI of ${bmi.toFixed(1)} indicates underweight. Consider increasing daily calories by 300-500 above your TDEE of ${tdee} calories.`,
        actionItems: ['Add healthy snacks between meals', 'Include protein-rich foods', 'Consider consulting a nutritionist']
      });
    } else if (bmi >= 30) {
      urgentAlerts.push('Your BMI indicates obesity. Please consult a healthcare provider.');
      recommendations.push({
        category: 'Weight', priority: 'high', title: 'Weight Management Plan',
        description: `Your BMI of ${bmi.toFixed(1)} indicates obesity. Target a gradual weight loss of 0.5-1 kg per week.`,
        actionItems: ['Create a caloric deficit of 500-750 calories/day', 'Increase physical activity', 'Focus on whole foods', 'Track your meals']
      });
    } else if (bmi >= 25) {
      recommendations.push({
        category: 'Weight', priority: 'medium', title: 'Maintain Healthy Weight',
        description: `Your BMI of ${bmi.toFixed(1)} is slightly elevated. Your ideal weight range is ${idealWeight - 5}-${idealWeight + 5} kg.`,
        actionItems: ['Monitor portion sizes', 'Increase vegetable intake', 'Reduce processed foods']
      });
    }

    if (heartRateScore < 100) {
      recommendations.push({
        category: 'Cardiovascular', priority: heartRate > 100 ? 'high' : 'medium', title: 'Heart Rate Optimization',
        description: `Your resting heart rate of ${heartRate} bpm is ${heartRateStatus.toLowerCase()}. Target range: 60-80 bpm.`,
        actionItems: ['Practice deep breathing exercises', 'Reduce caffeine intake', 'Regular cardio exercise', 'Manage stress levels']
      });
    }

    if (bpScore < 100 && bloodPressureSystolic) {
      const priority = bpScore < 50 ? 'high' : 'medium';
      if (bpScore <= 40) urgentAlerts.push('Your blood pressure is dangerously high. Seek medical attention.');
      recommendations.push({
        category: 'Cardiovascular', priority, title: 'Blood Pressure Management',
        description: `Your blood pressure (${bloodPressureSystolic}/${bloodPressureDiastolic}) is ${bpCategory.toLowerCase()}.`,
        actionItems: ['Reduce sodium intake', 'Increase potassium-rich foods', 'Regular exercise', 'Limit alcohol', 'Manage stress']
      });
    }

    if (sleepScore < 100) {
      recommendations.push({
        category: 'Sleep', priority: sleepScore < 50 ? 'high' : 'medium', title: 'Improve Sleep Quality',
        description: `You're getting ${sleepHours} hours of sleep. Adults need 7-9 hours for optimal health.`,
        actionItems: ['Set a consistent sleep schedule', 'Avoid screens 1 hour before bed', 'Keep bedroom cool and dark', 'Limit caffeine after 2 PM']
      });
    }

    if (exerciseScore < 85) {
      recommendations.push({
        category: 'Fitness', priority: exerciseScore < 50 ? 'high' : 'medium', title: 'Increase Physical Activity',
        description: `You're getting ${weeklyExercise} minutes of exercise per week. WHO recommends 150-300 minutes.`,
        actionItems: ['Start with 10-minute walks', 'Add strength training 2x/week', 'Take stairs instead of elevators', 'Try active hobbies']
      });
    }

    if (waterScore < 85) {
      recommendations.push({
        category: 'Hydration', priority: waterScore < 50 ? 'high' : 'low', title: 'Increase Water Intake',
        description: `You're drinking ${waterIntake} glasses. Your recommended intake is ${recommendedWater} glasses based on your weight and activity.`,
        actionItems: ['Carry a water bottle', 'Set hourly reminders', 'Drink water before meals', 'Eat water-rich foods']
      });
    }

    if (stressAnalysis.score > 40) {
      recommendations.push({
        category: 'Mental Health', priority: stressAnalysis.score > 60 ? 'high' : 'medium', title: 'Stress Management',
        description: `Your estimated stress level is ${stressAnalysis.level.toLowerCase()} based on your metrics.`,
        actionItems: ['Practice meditation or yoga', 'Take regular breaks', 'Connect with friends/family', 'Consider professional support if needed']
      });
    }

    if (smokingStatus === 'current') {
      urgentAlerts.push('Smoking significantly increases health risks. Consider a cessation program.');
      recommendations.push({
        category: 'Lifestyle', priority: 'high', title: 'Quit Smoking',
        description: 'Smoking is the leading cause of preventable death. Quitting now dramatically improves your health.',
        actionItems: ['Set a quit date', 'Consider nicotine replacement therapy', 'Join a support group', 'Identify triggers and alternatives']
      });
    }

    return {
      overallScore, healthGrade, metabolicAge, chronologicalAge: age,
      metrics: {
        bmi: { value: bmi.toFixed(1), category: bmiCategory, score: bmiScore, risk: bmiRisk, idealRange: '18.5-24.9' },
        heartRate: { value: heartRate, status: heartRateStatus, score: heartRateScore, zone: heartRateZone, maxHR: maxHeartRate, targetZone: `${Math.round(maxHeartRate * 0.5)}-${Math.round(maxHeartRate * 0.85)}` },
        bloodPressure: { systolic: bloodPressureSystolic || null, diastolic: bloodPressureDiastolic || null, category: bpCategory, score: bpScore, risk: bpRisk },
        sleep: { value: sleepHours, status: sleepStatus, score: sleepScore, quality: sleepQuality, recommended: '7-9 hours' },
        exercise: { value: exerciseMinutes, weeklyTotal: weeklyExercise, status: exerciseStatus, score: exerciseScore, level: exerciseLevel, recommended: '150-300 min/week' },
        water: { value: waterIntake, recommended: recommendedWater, status: waterStatus, score: waterScore, percentage: Math.round(waterPercentage) },
        lifestyle: { score: lifestyleScore, factors: lifestyleFactors },
        stress: stressAnalysis
      },
      advancedMetrics: {
        bmr, tdee, idealWeight: { min: idealWeight - 5, max: idealWeight + 5, target: idealWeight },
        bodyFatEstimate, metabolicAge, caloriesForWeightLoss: tdee - 500, caloriesForWeightGain: tdee + 500
      },
      recommendations, urgentAlerts, timestamp: new Date().toISOString()
    };
  };

  // ─── Routes ──────────────────────────────────────────────────────────────────

  app.get('/', (req, res) => {
    res.json({ message: 'Health Analyzer API v2.0', status: 'running', mode: process.env.VERCEL ? 'vercel' : 'local' });
  });

  app.get('/api/health', (req, res) => {
    res.json({
      message: 'Health Analyzer API v2.0', status: 'healthy',
      features: ['BMI Analysis', 'Heart Rate Zones', 'Metabolic Age', 'TDEE Calculator', 'Stress Analysis']
    });
  });

  app.post('/api/analyze', (req, res) => {
    try {
      const healthData = req.body;
      const requiredFields = ['age', 'weight', 'height', 'heartRate', 'sleepHours', 'exerciseMinutes', 'waterIntake'];
      for (const field of requiredFields) {
        if (healthData[field] === undefined || healthData[field] === null) {
          return res.status(400).json({ error: `Missing required field: ${field}` });
        }
      }
      const analysis = analyzeHealth(healthData);
      healthHistory.push({ id: Date.now(), input: healthData, result: analysis });
      if (healthHistory.length > 50) healthHistory.shift();
      res.json(analysis);
    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({ error: 'Error analyzing health data', details: error.message });
    }
  });

  app.get('/api/history', (req, res) => {
    res.json(healthHistory.slice(-10).reverse());
  });

  app.get('/api/tips', (req, res) => {
    const tips = [
      { category: 'Nutrition', tip: 'Eat at least 5 servings of fruits and vegetables daily.' },
      { category: 'Exercise', tip: 'Take a 10-minute walk after each meal to aid digestion.' },
      { category: 'Sleep', tip: 'Maintain a consistent sleep schedule, even on weekends.' },
      { category: 'Hydration', tip: 'Start your day with a glass of water before coffee.' },
      { category: 'Mental Health', tip: 'Practice 5 minutes of mindfulness meditation daily.' },
      { category: 'Posture', tip: 'Take a break every 30 minutes if you sit for long periods.' },
      { category: 'Heart Health', tip: 'Reduce sodium intake to less than 2,300mg per day.' },
      { category: 'Immunity', tip: 'Get 15-20 minutes of sunlight daily for vitamin D.' }
    ];
    res.json(tips[Math.floor(Math.random() * tips.length)]);
  });

  // Health AI Chatbot System Prompt
  const HEALTH_SYSTEM_PROMPT = `You are HealthBot, a friendly and knowledgeable AI health assistant. Your role is to help users improve their health and wellness through personalized advice, motivation, and guidance.

  IMPORTANT GUIDELINES:
  1. Always be supportive, encouraging, and empathetic
  2. Provide evidence-based health information
  3. NEVER diagnose medical conditions - always recommend consulting healthcare professionals for medical concerns
  4. Focus on preventive health, lifestyle improvements, nutrition, exercise, sleep, and mental wellness
  5. Give actionable, practical advice that users can implement immediately
  6. Use emojis occasionally to be friendly but not excessively
  7. Keep responses concise but informative (2-4 paragraphs max unless asked for details)
  8. If someone mentions serious symptoms or emergencies, urge them to seek immediate medical attention
  9. Remember context from the conversation to provide personalized advice
  10. Celebrate user's health achievements and motivate them
  
  AREAS OF EXPERTISE:
  - Nutrition and healthy eating habits
  - Exercise routines and physical activity
  - Sleep optimization
  - Stress management and mental wellness
  - Weight management
  - Hydration
  - Healthy lifestyle habits
  - Preventive health measures
  - Fitness motivation
  - Healthy recipes and meal planning
  
  When users share their health metrics or goals, use that information to provide tailored advice.`;

  app.post('/api/chat', async (req, res) => {
    try {
      const { message, sessionId, healthContext } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      if (!groq) {
        return res.status(503).json({ error: 'AI assistant is not available. GROQ_API_KEY not configured.' });
      }

      let sessionHistory = chatSessions.get(sessionId) || [];

      const messages = [
        { role: 'system', content: HEALTH_SYSTEM_PROMPT },
      ];

      if (healthContext) {
        messages.push({
          role: 'system',
          content: `User's current health metrics: ${JSON.stringify(healthContext)}. Use this information to provide personalized advice.`
        });
      }

      const recentHistory = sessionHistory.slice(-10);
      messages.push(...recentHistory);
      messages.push({ role: 'user', content: message });

      const chatCompletion = await groq.chat.completions.create({
        messages,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false
      });

      const assistantMessage = chatCompletion.choices[0]?.message?.content || 'I apologize, but I encountered an issue. Please try again.';

      sessionHistory.push({ role: 'user', content: message });
      sessionHistory.push({ role: 'assistant', content: assistantMessage });

      if (sessionHistory.length > 20) {
        sessionHistory = sessionHistory.slice(-20);
      }
      chatSessions.set(sessionId, sessionHistory);

      res.json({ message: assistantMessage, sessionId });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to get response from health assistant', details: error.message });
    }
  });

  app.delete('/api/chat/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    chatSessions.delete(sessionId);
    res.json({ message: 'Chat session cleared' });
  });

  app.get('/api/ai-tip', async (req, res) => {
    try {
      if (!groq) {
        const fallbackTips = [
          { category: 'Nutrition', tip: '🥗 Eat at least 5 servings of fruits and vegetables daily.' },
          { category: 'Exercise', tip: '🚶 Take a 10-minute walk after each meal to aid digestion.' },
          { category: 'Sleep', tip: '😴 Maintain a consistent sleep schedule, even on weekends.' },
        ];
        return res.json(fallbackTips[Math.floor(Math.random() * fallbackTips.length)]);
      }

      const categories = ['nutrition', 'exercise', 'sleep', 'mental health', 'hydration', 'stress management'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a health expert. Provide one short, actionable health tip. Be concise (1-2 sentences max). Include one relevant emoji at the start.' },
          { role: 'user', content: `Give me a unique, practical ${randomCategory} tip for better health.` }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.9,
        max_tokens: 150
      });

      const tip = chatCompletion.choices[0]?.message?.content || '💪 Stay active and drink plenty of water!';
      res.json({ category: randomCategory.charAt(0).toUpperCase() + randomCategory.slice(1), tip });
    } catch (error) {
      console.error('AI tip error:', error);
      const fallbackTips = [
        { category: 'Nutrition', tip: '🥗 Eat at least 5 servings of fruits and vegetables daily.' },
        { category: 'Exercise', tip: '🚶 Take a 10-minute walk after each meal to aid digestion.' },
        { category: 'Sleep', tip: '😴 Maintain a consistent sleep schedule, even on weekends.' },
      ];
      res.json(fallbackTips[Math.floor(Math.random() * fallbackTips.length)]);
    }
  });

  return app;
}

module.exports = { createApp };