const express=require("express");
const { authbyadmin } = require("../middleware/authbyadmin.middleware");
const { authenticate } = require("../middleware/authenticate.middleware");
const {MyOrderModel} = require("../model/MyOrder.model");
const { ProductModel } = require("../model/Product.model");
const { UserModel } = require("../model/User.model")

const myorderRouter=express.Router()


// Order all products from cart
myorderRouter.post('/cartitem/', authenticate, async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userId).populate('cart');
    if (!user.cart.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const products = user.cart.map(item => ({
      product: item._id,
      quantity: 1,
      price: item.price
    }));

    const order = new MyOrderModel({
      user: user._id,
      products
    });

    await order.save();
    user.cart = [];
    await user.save();

    res.json({ message: 'Order placed successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update the order status of a product
myorderRouter.patch('/orderstatus/:orderId/', authbyadmin, async (req, res) => {
  
  try {
    const order = await MyOrderModel.findById(req.params.orderId);
    if (!order) {
      
      return res.status(404).json({ error: 'Order not found' });
    }
    console.log(order)
    const { status } = req.body;
    if (!status || !['Pending', 'Shipped', 'Delivered'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* // Cancel an order
myorderRouter.patch('/cancel/:orderId', authenticate, async (req, res) => {
  try {
    const order = await MyOrderModel.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.user.toString() !== req.body.userId.toString()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (order.cancelled) {
      return res.status(400).json({ error: 'Order already cancelled' });
    }

    order.cancelled = true;
    await order.save();

    res.json({ message: 'Order cancelled successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}); */

myorderRouter.delete('/cancel/:orderId', authenticate, async (req, res) => {
  try {
    const user = req.body;
    const orderId = req.params.orderId;

    // Find the order by its ID
    const order = await MyOrderModel.findOne({ _id: orderId, user: user.userId });

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // If the order is already shipped or delivered, it cannot be cancelled
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Cannot cancel order, it has already been shipped or delivered' });
    }

    // Delete the order and update its status to 'cancelled'
    await MyOrderModel.findOneAndDelete({ _id: orderId, user: user.userId });
    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Get all orders for the current user
myorderRouter.get('/orders', authenticate, async (req, res) => {
  try {
    const orders = await MyOrderModel.find({ user: req.body.userId }).populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});




module.exports={
    myorderRouter
}