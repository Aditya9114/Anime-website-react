import { Error } from "mongoose";
import { Comments } from "../models/comments.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Anime ID is missing");
    }

    const comments = await Comments.find({ animeId: Number(id) }).sort({
      createdAt: -1,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, comments, "Comments fetched successfully"));
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

const addComment = async (req, res) => {
  try {
    const { animeId, content } = req.body;
    if (!animeId || !content) {
      throw new ApiError(400, "Anime ID and text are required");
    }
    const comment = await Comments.create({
      animeId,
      user: req.user._id,
      content
    });
    return res
            .status(201)
            .json(
                new ApiResponse(201,comment, "Comment Added Successfully")
            )
  } catch (err) {
    return res
    .status(500)
    .json(new ApiError(500,"Something went Wrong"))
  }
};

export { getComments, addComment};
