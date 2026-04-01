import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { addToFavourites } from "../controllers/favourites.controller.js";

const router = Router();
router.route('/').post(verifyJWT,addToFavourites )
export default router;