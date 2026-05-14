import { Router } from "express";
import { addComment, getComments, deleteComment } from "../controllers/comments.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.route("/:id").get(getComments);
router.route("/add").post(verifyJWT,addComment);
router.delete("/delete/:id", verifyJWT, deleteComment);

export default router;