const express = require('express');
const router = express.Router();
const { getPRs } = require('./prController');

router.get('/getPRs', getPRs);

module.exports = router;
