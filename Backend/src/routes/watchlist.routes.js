import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { getwatchlist, addToWatchlist } from "../controllers/watchlist.controller.js";

const router = Router ();
router.route("/").post(verifyJWT, addToWatchlist);
router.route("/list").get(verifyJWT, getwatchlist)
export default router;