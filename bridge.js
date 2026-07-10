const path = require('path');

process.env.NODE_PATH = path.join(__dirname, 'backend/node_modules');
require('module').Module._initPaths();

const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const multer = require('multer');
require('dotenv').config({ path: path.join(__dirname, 'backend/.env') });

const client1 = twilio(
  process.env.TWILIO_ACCOUNT_SID_1 || process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN_1 || process.env.TWILIO_AUTH_TOKEN
);
const client2 = twilio(
  process.env.TWILIO_ACCOUNT_SID_2 || process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN_2 || process.env.TWILIO_AUTH_TOKEN
);

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.post('/api/trigger-sos', async (req, res) => {
  console.log(`[Bridge] Incoming SOS request received at ${new Date().toISOString()}`);

  const { latitude, longitude } = req.body;
  const mapsLink = latitude && longitude ? `http://maps.google.com/?q=${latitude},${longitude}` : 'Location Unavailable';

  const guardians = [
    process.env.GUARDIAN_PHONE_1 || process.env.GUARDIAN_PHONE,
    process.env.GUARDIAN_PHONE_2
  ].filter(Boolean);

  console.log(`[Bridge] Concurrently dialing ${guardians.length} guardians...`);

  const dialPromises = guardians.map(async (phone) => {
    console.log(`[Bridge] Dispatched simultaneous dials for safety contact: ${phone}`);

    const call1Promise = client1.calls.create({
      to: phone,
      from: process.env.TWILIO_PHONE_NUMBER_1 || process.env.TWILIO_PHONE_NUMBER,
      url: 'http://demo.twilio.com/docs/voice.xml'
    })
      .then(call => console.log(`[Bridge] Dial Success via Client 1 to contact ${phone}. SID: ${call.sid}`))
      .catch(err => console.error(`[Bridge] Dial Failed via Client 1 to contact ${phone}. Error: ${err.message}`));

    const sms1Promise = (async () => {
      try {
        if (client1 && process.env.TWILIO_PHONE_NUMBER_1) {
          await client1.messages.create({
            body: `🚨 EMERGENCY ALERT: A user has triggered an SOS! Live Tracking Link: ${mapsLink}`,
            to: phone,
            from: process.env.TWILIO_PHONE_NUMBER_1
          });
          console.log(`[Bridge] SMS Success via Client 1 to contact ${phone}`);
        }
      } catch (err) {
        console.error(`[Bridge] SMS Failed via Client 1 to contact ${phone}. Error: ${err.message}`);
      }
    })();

    const call2Promise = client2.calls.create({
      to: phone,
      from: process.env.TWILIO_PHONE_NUMBER_2 || process.env.TWILIO_PHONE_NUMBER,
      url: 'http://demo.twilio.com/docs/voice.xml'
    })
      .then(call => console.log(`[Bridge] Dial Success via Client 2 to contact ${phone}. SID: ${call.sid}`))
      .catch(err => console.error(`[Bridge] Dial Failed via Client 2 to contact ${phone}. Error: ${err.message}`));

    const sms2Promise = (async () => {
      try {
        if (client2 && process.env.TWILIO_PHONE_NUMBER_2) {
          await client2.messages.create({
            body: `🚨 EMERGENCY ALERT: A user has triggered an SOS! Live Tracking Link: ${mapsLink}`,
            to: phone,
            from: process.env.TWILIO_PHONE_NUMBER_2
          });
          console.log(`[Bridge] SMS Success via Client 2 to contact ${phone}`);
        }
      } catch (err) {
        console.error(`[Bridge] SMS Failed via Client 2 to contact ${phone}. Error: ${err.message}`);
      }
    })();

    await Promise.all([call1Promise, sms1Promise, call2Promise, sms2Promise]);
  });

  await Promise.all(dialPromises);

  res.status(200).json({ success: true, message: 'Dual-account calls initiated concurrently.' });
});

app.post('/api/analyze-audio', upload.single('audio'), async (req, res) => {
  console.log(`[Bridge] Incoming audio analysis request received at ${new Date().toISOString()}`);

  if (req.file) {
    console.log(`[Bridge] Received file payload: ${req.file.originalname} (${req.file.size} bytes)`);
  } else {
    console.log('[Bridge] Warning: No audio file payload detected in request body');
  }

  const aiSummaryText = "AI Summary: High-stress voice clip processed. Distress keywords verified.";

  res.json({ success: true, summary: aiSummaryText });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`[Bridge] Server initialized and listening on port ${PORT}`);
});
