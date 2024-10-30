const mongoose=require("mongoose");

const schema=mongoose.Schema;
const objectId=mongoose.ObjectId;


mongoose.connect(process.env.mongourl);


const userSchema=new schema({
    email:{
        type:String,unique:true
    },
    password:String,
    firstname:String,
    lastname:String
})


const bookSchema=new schema({
    title:String,
    description:String,
    bookid:Number,
    price:Number
})

const bookIssuedSchema=new schema({
    bookid:Number,
    userid:objectId
})

const usermodel=mongoose.model("user",userSchema);
const bookmodel=mongoose.model("books",bookSchema);
const issuedmodel=mongoose.model("issuedBooks",bookIssuedSchema);

module.exports={
    usermodel:usermodel,
    bookmodel:bookmodel,
    issuedmodel:issuedmodel
}