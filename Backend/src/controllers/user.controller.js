import { Error } from "mongoose";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getCurrentUser = (req,res) =>{
    return res.status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current User Fetched Successfully"
            )
        )
}

export { getCurrentUser }