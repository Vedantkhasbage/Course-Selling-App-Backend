const Router=require("express");
const bookRouter=Router();
const {bookmodel,issuedmodel}=require("../database");
const { usermiddleware } = require("../middleware/user");


bookRouter.post('/addbooks',usermiddleware ,async function(req,res){
      
         const randomBookId=Math.random()
         const {title,description,price}=req.body;
         await bookmodel.create({
            title:title,
            description:description,
            price:price,
             bookid:randomBookId
         })
         res.json({
            message:"Book Added"
         })
})

bookRouter.get('/viewbooks', async function(req,res){
    const Availablebooks= await bookmodel.find({})
   res.json({
    Availablebooks
   })
})


bookRouter.post('/issuebook', usermiddleware, async function(req,res){
             const userid=req.userid;
             const {bookid}=req.body;
                //  console.log(userid);
             //first find in issued book that whether this book is already in use or not
             const findbookwithId=await bookmodel.findOne({
               bookid:bookid
             })
                //    console.log(findbookwithId);
                   //if not exit in database so book not exists
                   if(!findbookwithId){
                       res.json({
                           message:"Book not exists"
                        })
                        return;
                    }
                    
                    const findWhetherIssueOrNot=await issuedmodel.findOne({
                        userid:userid,
                        bookid:bookid
                    })
                    console.log(findWhetherIssueOrNot);
             //if both true means book already issued
              if(findWhetherIssueOrNot && findbookwithId){
                res.json({
                    message:"Sorry book not available"
                })
                return;
              }
           
              await issuedmodel.create({
                userid:userid,
                bookid:bookid
              })
                 
                res.json({
                    message:"You successfully Issue the book"
                })
           
})

bookRouter.get('/issued',usermiddleware, async function(req,res){
          const issuedbooks=await issuedmodel.find({})

          res.json({
            IssuedBooks:issuedbooks
          })
})

bookRouter.put('/returnbooks', usermiddleware,async function(req,res){
             const userid=req.userid; 
             const {bookid}=req.body;
             
             await issuedmodel.deleteOne({
              userid:userid,
              bookid:bookid
             })
  
             res.json({
              message:"Book returned Successfully"
             })
     
})


module.exports={
    bookRouter:bookRouter
}