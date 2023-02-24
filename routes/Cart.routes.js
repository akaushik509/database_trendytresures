const express=require("express")
const {authbyadmin}=require("../middleware/authbyadmin.middleware")
const {authenticate}=require("../middleware/authenticate.middleware")
const { ProductModel } = require("../model/Product.model")
const { UserModel } = require("../model/User.model")

const cartRouter=express.Router()

// Add a product to the cart
cartRouter.post('/addtocart', authenticate, async (req, res) => {
  const a = req.body.userId
  try {
    const product = await ProductModel.findById(req.body.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const user = await UserModel.findById(a);
    user.cart.push(product._id);
    await user.save();

    res.json({ message: 'Product added to cart' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products in the cart
cartRouter.get('/getcart', authenticate, async (req, res) => {
  const a = req.body.userId
  console.log(a)
  try {
    const user = await UserModel.findById(a).populate('cart');
    res.json(user.cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove a product from the cart
cartRouter.delete('/removefromcart/:productId', authenticate, async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userId);
    const index = user.cart.indexOf(req.params.productId);
    if (index > -1) {
      user.cart.splice(index, 1);
      await user.save();
      res.json({ message: 'Product removed from cart' });
    } else {
      res.status(404).json({ error: 'Product not found in cart' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});




module.exports={
    cartRouter
}