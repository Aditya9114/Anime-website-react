import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { addToFavourites,getFav,removeFav } from "../controllers/favourites.controller.js";

const router = Router();
router.route('/').post(verifyJWT,addToFavourites )
router.route('/list').get(verifyJWT,getFav)
router.route('/list/remove').delete(verifyJWT,removeFav)
export default router;