const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.post('/create-room', roomController.createRoom);
router.get('/:code', roomController.getRoom); 
module.exports = router;