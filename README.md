# Health Analyzer

A modern health analysis application with React + Tailwind CSS frontend and Node.js backend.

## Project Structure

```
health_analyzer/
├── frontend/          # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── HealthForm.jsx
│   │   │   ├── Results.jsx
│   │   │   └── Footer.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── backend/           # Node.js + Express
│   ├── server.js
│   └── package.json
└── README.md
```

## Getting Started

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Start Backend Server

```bash
npm run dev
```

The API will run on http://localhost:5000

### 3. Install Frontend Dependencies (new terminal)

```bash
cd frontend
npm install
```

### 4. Start Frontend Development Server

```bash
npm run dev
```

The app will run on http://localhost:3000

## Features

- 🏥 Health metrics input (age, weight, height, heart rate, sleep, exercise, water intake)
- 📊 BMI calculation and analysis
- 💯 Overall health score calculation
- 💡 Personalized health recommendations
- 🎨 Clean, modern UI with Tailwind CSS
- 📱 Fully responsive design

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/analyze` - Analyze health data

## Technologies

**Frontend:**
- React 18
- Vite
- Tailwind CSS

**Backend:**
- Node.js
- Express
- CORS
