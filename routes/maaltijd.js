// Require modules
const express = require('express');
const auth = require('../middleware/auth');
const database = require('../database');
const { validate } = require('../models/maaltijd');

// Get router
const router = express.Router();

module.exports = router;