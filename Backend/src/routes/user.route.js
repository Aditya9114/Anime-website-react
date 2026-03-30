import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { getCurrentUser } from "../controllers/user.controller.js";

const router = Router();
router.route('/me').get(verifyJWT,getCurrentUser )
export default router;