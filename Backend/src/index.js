import dotenv from "dotenv"
import dbConnect from "./db/db.js"
import { app } from "./app.js"
import path from "path";
import express from "express"

dotenv.config()
const PORT = process.env.PORT;

const __dirname = path.resolve();

if(process.env.NODE_ENV==="production"){
      app.use(express.static(path.join(__dirname,"../Frontend/dist")));
    
      app.get(/.*/,(req,res)=>{
        res.sendFile(path.join(__dirname,"../Frontend","dist","index.html"));
      })
    }
    
dbConnect()
.then(()=>{
    

    app.listen(PORT,()=>{
        console.log(`Server is running on Port ${PORT}\nThe url is http://localhost:${PORT}`)
    })
}
)
.catch((err)=>{
    console.log(err);
})


