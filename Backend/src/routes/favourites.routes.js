import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { addToFavourites,getFav } from "../controllers/favourites.controller.js";

const router = Router();
router.route('/').post(verifyJWT,addToFavourites )
router.route('/list').get(verifyJWT,getFav)
export default router;