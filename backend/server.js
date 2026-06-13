// Local development server — imports shared health-core and starts listening
require('dotenv').config();
const { createApp } = require('../shared/health-core');

const app = createApp();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Health Analyzer API v2.0 running on http://localhost:${PORT}`);
  console.log(`🤖 HealthBot AI Assistant enabled`);
});