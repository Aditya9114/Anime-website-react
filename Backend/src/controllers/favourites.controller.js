import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const addToFavourites = async (req, res) => {
  try {
    const { anime_id } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { favourites: anime_id },
      },
      { new: true },
    );
    console.log(req.user.favourites);

    return res
      .status(200)
      .json(new ApiResponse(200, user.favourites, "Added to favourites"));
  } catch (err) {
    throw new ApiError(500, "Failed to add to favourites");
  }
};

const getFav = async(req,res) =>{
  try{
    const user = await User.findById(req.user._id);
    if(!user){
      throw new ApiError(404,"User not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user.favourites, "User's Favourite Anime fetched Successfully"))
  } 
  catch(err){
    throw new ApiError(500, "Failed to fetch favourites");
  }
}

export { addToFavourites, getFav };
