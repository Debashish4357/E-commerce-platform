const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Get all orders
router.get('/orders', auth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('rider', 'name')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.patch('/orders/`:id/status', auth, isAdmin, async (req, res) => {
  try {
    const { status, riderId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status === 'shipped' && !riderId) {
      return res.status(400).json({ message: 'Rider ID is required when shipping order' });
    }

    if (status === 'shipped') {
      const rider = await User.findById(riderId);
      if (!rider || rider.role !== 'rider') {
        return res.status(400).json({ message: 'Invalid rider' });
      }
      order.rider = riderId;
    }

    order.status = status;
    order.updatedAt = new Date();
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all riders
router.get('/riders', auth, isAdmin, async (req, res) => {
  try {
    const riders = await User.find({ role: 'rider' });
    res.json(riders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 