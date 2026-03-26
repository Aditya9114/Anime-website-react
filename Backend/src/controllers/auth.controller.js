import { Error } from "mongoose";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

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
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user",
      );
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          { user: createdUser },
          "User registration successful",
        ),
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
      const createdUser = await User.findById(existedUser._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
      );

      return res
        .status(200)
        .json(
          new ApiResponse(
            201,
            { user: createdUser },
            "User logged in Successfully",
          ),
        );
    }
  } catch (err) {
    throw err;
  }
};

export { registerUser, loginUser };
