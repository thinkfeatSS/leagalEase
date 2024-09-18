const express = require('express');
const exampleController = require('../controllers/exampleController');

const router = express.Router();

router.get('/example', exampleController.getExample);
router.post('/example', exampleController.postExample);

module.exports = router;