
const authbyadmin=(req,res,next)=>{
    const token=req.headers.authbyadmin
    console.log(token)
    if(token=="token name is avinash"){
        console.log(token)
        next()
    }else {
        res.send({"msg":"Please Login"})
    }
}

module.exports={
    authbyadmin
}