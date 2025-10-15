const express = require('express');
const router = express.Router();
const { getTaskLogs } = require('../controllers/taskLogsController');

router.get('/', getTaskLogs);

module.exports = router;
