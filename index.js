const express = require("express")
const {connection} = require("./configs/db")
const {userRouter}=require("./routes/User.routes")


const {authenticate}=require("./middleware/authenticate.middleware")
const cors=require("cors")
const { productRouter } = require("./routes/Product.routes")
const { cartRouter } = require("./routes/Cart.routes")
const { myorderRouter } = require("./routes/MyOrder.routes")
const { adminRouter } = require("./routes/Admin.routes")
const { authbyadmin } = require("./middleware/authbyadmin.middleware")

const app = express()

app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.send("Home Page")
})

app.use("/users", userRouter)
app.use("/admin",adminRouter)
app.use("/prod",productRouter)
app.use("/cart",cartRouter)
app.use("/myorder",myorderRouter)



app.listen(8080,async()=>{
    try{
        await connection
        console.log("Connected to DB")
    }catch(err){
        console.log(err.message)
    }
    console.log("Server is running at 8080")
})

/* */