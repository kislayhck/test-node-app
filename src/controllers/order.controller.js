const Order = require('../models/order.model');

const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ user: userId })
      .populate('user', 'email')
      .populate('products', 'name price');

    return res.status(200).json({
      message: 'Order history fetched successfully',
      data: orders,
    });
  } catch (error) {
    console.error('Get order history error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { products, totalAmount } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Products array is required and cannot be empty' });
    }

    if (totalAmount === undefined || totalAmount < 0) {
      return res.status(400).json({ error: 'Valid totalAmount is required' });
    }

    const order = new Order({
      user: userId,
      products,
      totalAmount,
    });

    await order.save();
    await order.populate('user', 'email');
    await order.populate('products', 'name price');

    return res.status(201).json({
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('Create order error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { products, totalAmount } = req.body;

    if (!products && totalAmount === undefined) {
      return res.status(400).json({ error: 'At least one field (products or totalAmount) is required' });
    }

    const order = await Order.findOne({ _id: id, user: userId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (products && Array.isArray(products) && products.length > 0) {
      order.products = products;
    }

    if (totalAmount !== undefined && totalAmount >= 0) {
      order.totalAmount = totalAmount;
    }

    await order.save();
    await order.populate('user', 'email');
    await order.populate('products', 'name price');

    return res.status(200).json({
      message: 'Order updated successfully',
      data: order,
    });
  } catch (error) {
    console.error('Update order error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const order = await Order.findOneAndDelete({ _id: id, user: userId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json({
      message: 'Order deleted successfully',
      data: order,
    });
  } catch (error) {
    console.error('Delete order error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getOrderHistory,
  createOrder,
  updateOrder,
  deleteOrder,
};
