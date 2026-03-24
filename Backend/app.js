import express, { json } from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js"

const app = express();
app.use(cors());
app.use(express.json());         // parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse form data
app.use("/api/v1/auth",authRouter)


app.get('/', (req,res)=>{
    res.send("hello");
})
export default app;