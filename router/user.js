const Router=require("express");
const userRouter=Router();
const {z}=require("zod");
const bcrypt=require("bcrypt");
const {usermodel, issuedmodel}=require("../database");
const jwt=require("jsonwebtoken");
const {JWT_USER_KEY}=require("../jwtkey");
const { usermiddleware } = require("../middleware/user");


 userRouter.post('/signUp', async function(req,res){
    const requireddata=z.object({
        email:z.string().min(5).max(100).email(),
        password:z.string().min(5).max(100),
        firstname:z.string().min(5).max(100),
        lastname:z.string().min(5).max(100)
    })

    const checkInputtype=requireddata.safeParse(req.body);
    if(!checkInputtype.success){
        res.json({
            message:"Invalid type"
        })
        return;
    }

    const {email,password,firstname,lastname}=req.body;
      const hashedpassword=  await bcrypt.hash(password,5);

     await usermodel.create({
        email:email,
        password:hashedpassword,
        firstname:firstname,
        lastname:lastname
     })

     res.json({
        message:"You successfully signed Up"
     })
 })


  userRouter.post('/signIn', async function(req,res){
    const requireddata=z.object({
        email:z.string().min(5).max(100).email(),
        password:z.string().min(5).max(100),
    })

    const checkInputtype=requireddata.safeParse(req.body);
    if(!checkInputtype.success){
        res.json({
            message:"Invalid type"
        })
        return;
    }

    const {email,password}=req.body;
         const checkUserExistOrNot=await usermodel.findOne({
            email:email,
         })

         if(!checkUserExistOrNot){
            res.json({
                message:"Sorry user not exists"
            }) 
            return;
         }

         const findUser=await bcrypt.compare(password,checkUserExistOrNot.password);
         if(findUser){
               const token=jwt.sign({
                 id:checkUserExistOrNot._id
               },JWT_USER_KEY)
               res.json({
                token:token
               })
         } else{
            res.json({
                message:"User Not exist"
            })
         }
  })


  userRouter.get('/mybooks', usermiddleware, async function(req,res){
      const userid=req.userid;
      const GetMyIssuedBooks=await issuedmodel.find({
        userid:userid
      })

      res.json({
        books:GetMyIssuedBooks
      })
      
  })
module.exports={
    userRouter:userRouter
}