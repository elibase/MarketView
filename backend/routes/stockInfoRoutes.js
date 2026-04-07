const express = require('express');
const router = express.Router();

const stockController = require('../controllers/stockInfoController.js');

router.get('/', stockController.getStocks);

module.exports = router;