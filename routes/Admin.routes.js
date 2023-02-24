const express=require("express")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt");
const { authbyadmin } = require("../middleware/authbyadmin.middleware");
const { UserModel } = require("../model/User.model");
const { MyOrderModel } = require("../model/MyOrder.model");
const { ProductModel } = require("../model/Product.model");

const adminRouter=express.Router();

adminRouter.post("/login",async(req,res)=>{
    const {email,pass}=req.body
    try{
        if(email=="admin" && pass=="avinash"){
            res.send({"msg":"Logged In","token":"token name is avinash"})
        }else{
            res.send({"msg":"Wrong Credential"})
        }
    }catch(err){
        res.send({"msg":"Something went wrong","Error":err})
    }
})

adminRouter.get('/allusers', authbyadmin, async (req, res) => {
    try {
      // Find all users in the database
      const users = await UserModel.find();
  
      // Return the users
      res.json(users);
    } catch (err) {
      // Return an error message
      res.status(500).json({ error: err.message });
    }
  });

  // Get all orders for all users
  adminRouter.get('/orders', authbyadmin, async (req, res) => {
    try {
      const orders = await MyOrderModel.find().populate('user').populate('products.product');
      res.json(orders);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Update product active state
  adminRouter.patch('/:productId', authbyadmin, async (req, res) => {
    try {
      const productId = req.params.productId;
      const isActive = req.body.isActive;
      await ProductModel.findByIdAndUpdate(productId, { isActive: isActive });
      res.json({ message: 'Product updated' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

module.exports={
    adminRouter
}