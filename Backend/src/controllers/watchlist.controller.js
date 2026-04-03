import { Error } from "mongoose";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const addToWatchlist = async (req, res) => {
  const { anime_id } = req.body;
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { watchList: anime_id } },
      { new: true },
    );

    return res
        .status(201)
        .json(
            new ApiResponse(201,"", "Added to watchList")
        )

  } catch (err) {
    throw new ApiError(500, "Failed to add to WatchList");
    console.log(err);
  }
};


const getwatchlist = async(req,res) =>{
  try{
    const user = await User.findById(req.user._id);
    if(!user){
      throw new ApiError(404,"User not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user.watchList, "User's Watchlist fetched Successfully"))
  } 
  catch(err){
    throw new ApiError(500, "Failed to fetch watchlist");
  }
}


export {addToWatchlist, getwatchlist};
