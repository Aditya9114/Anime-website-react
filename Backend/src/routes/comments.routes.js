import { Router } from "express";
import { addComment, getComments } from "../controllers/comments.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.route("/:id").get(getComments);
router.route("/add").post(verifyJWT,addComment);

export default router;