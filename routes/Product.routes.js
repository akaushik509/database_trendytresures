const express=require("express")
const {ProductModel}=require("../model/Product.model")
const {authbyadmin}=require("../middleware/authbyadmin.middleware")
const {authenticate}=require("../middleware/authenticate.middleware")
const productRouter=express.Router()

productRouter.get('/search', async (req, res) => {
    try {
        console.log(req.query);
        for(let k in req.query){
          console.log(k)
          if(k=="name"){
            
            const products = await ProductModel.find({ name: { "$regex": req.query[k] }});
            res.json(products);
          }else if(k=="brand"){
            const products = await ProductModel.find({ brand: { "$regex": req.query[k] }});
            res.json(products);
          }else if(k=="category"){
            const products = await ProductModel.find({ category: { "$regex": req.query[k] }});
            res.json(products);
          }else if(k=="type"){
            const products = await ProductModel.find({ type: { "$regex": req.query[k] }});
            res.json(products);
          }
        }      
      
    } catch (err) {
      console.error(err);

      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get products with price less than or equal to a certain value
  productRouter.get('/lessthan/:price', (req, res) => {
    const price = req.params.price;
    ProductModel.find({ price: { $lte: price } })
      .then(products => res.json(products))
      .catch(err => console.log(err));
  });

  // Get products with price greater than or equal to a certain value
  productRouter.get('/greaterthan/:price', (req, res) => {
    const price = req.params.price;
    ProductModel.find({ price: { $gte: price } })
      .then(products => res.json(products))
      .catch(err => console.log(err));
  });

productRouter.get("/",async(req,res)=>{
    try{
        const product=await ProductModel.find()
        res.send(product)
    }catch(e){
        res.send("Error",e.message)
    }
    
})

productRouter.get('/:id',async (req, res) => {
    try {
      const product = await ProductModel.findById(req.params.id);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

productRouter.post("/addproduct",authbyadmin,async(req,res)=>{
    try{
        const newproduct=req.body
        const product=new ProductModel(newproduct)
        await product.save()
        res.send({"msg":"product added"})
    }catch(err){
        console.log(err)
        res.send({"msg":err.message})
    }
})


productRouter.delete("/delete/:id",authbyadmin,async(req,res)=>{
    const noteID=req.params.id 
    try {
        await ProductModel.findByIdAndDelete(noteID);
        res.json("Deleted");
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
})

productRouter.patch("/update/:id",authbyadmin,async(req,res)=>{
    const updatedProductDetails=req.body
    const noteID=req.params.id 
    const note = await ProductModel.findOne({"_id":noteID})
    const userID_in_note=note.userId
    const UserID_making_req=req.body.userId //`new ObjectId("${req.body.userId}")`
    try{
        if(UserID_making_req!==userID_in_note){
            console.log(UserID_making_req)
            console.log(userID_in_note)
            res.send({"msg":"You are not authorized"})
        }else{
            await ProductModel.findByIdAndUpdate({_id:noteID},updatedProductDetails)
            res.send({"msg":`Note with id: ${noteID} has been Updated`})
        }
        
    }catch(err){
        console.log(err)
        res.send({"msg":"Something went wrong"})
    }
    
}) 


module.exports={
    productRouter
}