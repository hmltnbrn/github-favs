const express = require('express');
const reposerver = require('./reposerver');
const github = require('./github');

const router = express.Router();

router.use('/reposerver', reposerver);
router.use('/github', github);

module.exports = router;
