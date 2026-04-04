import express, { json } from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.route.js"
import favouriteRouter from "./routes/favourites.routes.js"
import WatchListRouter from "./routes/watchlist.routes.js"
import CommentsRouter from "./routes/comments.routes.js"
import cookieParser from "cookie-parser";



const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://anime-website-react-nine.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());         // parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse form data
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/user", userRouter);
app.use("/api/v1/favourites", favouriteRouter);
app.use("/api/v1/watchlist", WatchListRouter)
app.use("/api/v1/comments", CommentsRouter);


app.get('/', (req,res)=>{
    res.send("hello");
})
export default app;