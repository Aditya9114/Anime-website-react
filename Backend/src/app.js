import express, { json } from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.route.js"

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
  })
);
app.use(express.json());         // parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse form data
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/user", userRouter);


app.get('/', (req,res)=>{
    res.send("hello");
})
export default app;