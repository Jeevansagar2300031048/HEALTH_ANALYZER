// Local development server — imports shared health-core and starts listening
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { createApp } = require('../shared/health-core');

const app = createApp();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Health Analyzer API v2.0 running on http://localhost:${PORT}`);
  console.log(`🤖 HealthBot AI Assistant enabled`);
});