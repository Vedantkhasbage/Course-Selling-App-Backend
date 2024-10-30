require('dotenv').config();
const express=require("express");
const app=express();
const {userRouter}=require("./router/user");
const { bookRouter } = require("./router/books");

app.use(express.json());

app.use('/user',userRouter);
app.use('/book',bookRouter);


app.listen(3000);