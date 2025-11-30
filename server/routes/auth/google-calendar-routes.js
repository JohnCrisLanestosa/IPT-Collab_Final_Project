const express = require('express');
const {
  generateCalendarAuthUrl,
  googleCalendarCallback,
  getCalendarEmbedUrl,
} = require('../../controllers/auth/google-calendar-controller');

const router = express.Router();

// Start OAuth flow for calendar
router.get('/calendar/connect', generateCalendarAuthUrl);

// OAuth callback
router.get('/calendar/callback', googleCalendarCallback);

// Get calendar embed URL
router.get('/calendar/embed', getCalendarEmbedUrl);

module.exports = router;
