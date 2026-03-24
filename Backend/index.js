import dotenv from "dotenv";
dotenv.config({
    path:"./.env",
});
import app from './app.js'
import connectDB from "./db/index.js";


const port = process.env.PORT || 3000;
connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log("Running");
    })
})
.catch((err)=>{
    console.error("MongoDB connection error", err)
})
