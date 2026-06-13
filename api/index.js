// Vercel Serverless Function — imports shared health-core and exports the app
const { createApp } = require('../shared/health-core');

const app = createApp();

module.exports = app;