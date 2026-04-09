const express = require('express');
const router = express.Router();

const newsController = require('../controllers/newsController.js');

router.post('/addKeyword', newsController.addKeyword);
router.post('/removeKeyword', newsController.removeKeyword);
router.post('/retrieveKeywords', newsController.retrieveKeywords);
router.post('/getArticles', newsController.getArticles);

module.exports = router;