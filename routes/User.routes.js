const express=require("express")
const {UserModel}=require("../model/User.model")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

const userRouter=express.Router();

userRouter.post("/register",async(req,res)=>{
    //const payload=req.body //or
    const {name,email,password,cart,orders,imageUrl } = req.body
    try{
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err) res.send({"msg":"Something went wrong", "Error":err.message})
            else{
                const user=new UserModel({name,email,password:hash,cart,orders,imageUrl})
                await user.save()
                res.send({"msg":"New User has been registered"})
            }
        })
    }catch(err){
        res.send({"msg":"Something went wrong", "Error":err.message})
    } 
})

userRouter.patch('/update/:id', (req, res) => {
    const id = req.params.id;
    const updates = req.body;
  
    UserModel.findByIdAndUpdate(id, updates, { new: true })
      .then(updatedUser => {
        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
      })
      .catch(err => console.log(err));
  });

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try{
        const user=await UserModel.find({email})
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(result){
                    let token=jwt.sign({userID:user[0]._id},"userauth")
                    console.log(token)
                    res.send({"msg":"Logged In","token":token,"userName":user[0].name})
                }else{
                    console.log("Wrong Credentials")
                    res.send({"msg":"Wrong Credentials"})
                }
            })
            
        }else{
            
        }
    }catch(err){
        res.send({"msg":"Something went wrong","Error":err})
    }
})

module.exports={
    userRouter
}