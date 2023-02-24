const mongoose=require("mongoose")

const productSchema=mongoose.Schema({
   /*  name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      imageUrl: {
        type: String
      },
      isActive: {
        type: Boolean,
        default: true
      }   */  

      name:{
        type: String,
        required:true
      },
      oldprice:{
        type:Number,
        required: true
      },
      price:{
        type:Number,
        required: true
      },
      brand:{
        type:String
      },
      imageUrl:{
        type:String,
        require: true
      },
      category:{
        type:String,
        require:true
      },
      isActive: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        enum: ['Mens', 'Womens', 'Mobile']
      }
})

const ProductModel=mongoose.model("allproduct",productSchema)

module.exports={
    ProductModel
}