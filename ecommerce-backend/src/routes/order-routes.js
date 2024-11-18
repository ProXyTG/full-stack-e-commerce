const express = require('express');
const { createOrder, getAllOrders } = require('../controllers/order.controller');

const router = express.Router();

router.post('/', createOrder);
router.get('/', getAllOrders);

module.exports = router;