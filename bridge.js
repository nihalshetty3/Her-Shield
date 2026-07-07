const path = require('path');

// Dynamically set NODE_PATH so requiring modules from backend/node_modules works out of the box
process.env.NODE_PATH = path.join(__dirname, 'backend/node_modules');
require('module').Module._initPaths();

const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, 'backend/.env') });

const { sendSMS } = require('./backend/src/services/sms.service');
const { makeEmergencyCall } = require('./backend/src/services/call.service');

const app = express();

app.use(cors());
app.use(express.json());

// Main integration endpoint
app.post('/api/trigger-sos', async (req, res) => {
  console.log(`[Bridge] Received SOS trigger request at ${new Date().toISOString()}`);
  
  const incident = {
    id: `AURA-${Date.now()}`,
    triggerType: 'Aura Core Click',
    status: 'Emergency'
  };

  try {
    // Fire off SMS and Call alerts in parallel
    await Promise.all([
      sendSMS(incident),
      makeEmergencyCall(incident)
    ]);

    console.log('[Bridge] Successfully triggered Twilio SMS and Call.');
    res.status(200).json({ success: true, message: 'Emergency alerts triggered successfully.' });
  } catch (error) {
    console.error('[Bridge] Failed to trigger Twilio services:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`[Bridge] Isolated orchestrator listening on port ${PORT}`);
});
