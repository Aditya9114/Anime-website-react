import { Error } from "mongoose";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token",
    );
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      throw new ApiError(409, "User with email or username already exists");
    }

    const user = await User.create({
      email,
      password,
      username,
      isEmailVerified: false,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    const { accessToken, refreshToken } =
      await generateAccessAndRefreshToken(createdUser._id);

    const options = {
      httpOnly: true,
      secure: false,
    };

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          201,
          {
            user: createdUser,
            accessToken,
            refreshToken,
          },
          "User registered and logged in successfully"
        )
      );
  } catch (err) {
    throw err;
  }
};

const loginUser = async (req, res) => {
  try {
    const { password, email } = req.body;
    const existedUser = await User.findOne({ email });

    if (!existedUser) {
      throw new ApiError(404, "User not found");
    }

    const correct = await existedUser.isPasswordCorrect(password);

    if (!correct) {
      throw new ApiError(400, "Invalid Credentials");
    } else {
      const loggedInUser = await User.findById(existedUser._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
      );

      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        loggedInUser._id,
      );

      const options = {
        httpOnly: true,
        secure: false,
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            201,
            { user: loggedInUser, accessToken, refreshToken },
            "User logged in Successfully",
          ),
        );
    }
  } catch (err) {
    throw err;
  }
};

const logoutUser = async (req,res) =>{
  try{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken : ""
            }
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: false
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged Out")
        )
  }
  catch(err){
    throw err;
  }
}


export { registerUser, loginUser, logoutUser};
