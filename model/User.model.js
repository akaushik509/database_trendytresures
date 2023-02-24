const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'allproduct'
      }],
      orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'myorder'
      }],
      imageUrl: {
        type: String,
        default: 'https://via.placeholder.com/150'
      },
      address: String,
      mobile: Number
})

const UserModel=mongoose.model("user",userSchema)

module.exports={
    UserModel
}