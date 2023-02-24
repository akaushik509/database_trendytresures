const mongoose=require("mongoose")

const myorderSchema=mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'allproduct',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered'],
    default: 'Pending'
  },
  cancelled: {
    type: Boolean,
    default: false
  }
})

const MyOrderModel=mongoose.model("myorder",myorderSchema)

module.exports={
    MyOrderModel
}

/* 63f5f351f1d00ecdca396d04 */