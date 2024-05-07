import { Request, Response } from "express";
import { User } from "../models/User";
import { readUsersData } from "../utils/fileUtils";
import crypto from "crypto";
import bcrypt from "bcrypt";

const generateHash = (pass: string): string => {
  const hashedPassword = crypto
    .pbkdf2Sync(pass, "mySecret", 10000, 64, "sha512")
    .toString("hex");
  return hashedPassword;
};

export const signIn = async (request: Request, response: Response) => {
  const { user_name, password } = request.body;
  if (!user_name || !password) {
    return response.status(200).json({
      message: "Username, password are required!",
      status: 400,
    });
  }
  if (user_name && password) {
    const users: User[] = readUsersData();
    const hashedPassword = generateHash(password as string);
    const loggedInUser = users.find((user) => user.username === user_name);
    console.log(loggedInUser, user_name, users);
    if (!loggedInUser) {
      return response.status(200).json({
        message: "Please enter correct credentials",
        status: 400,
      });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      loggedInUser.password
    );
    console.log(loggedInUser, isPasswordValid);
    if (!isPasswordValid) {
      return response.status(200).json({
        message: "Please enter correct credentials",
        status: 400,
      });
    }

    if (loggedInUser.isDisabled) {
      return response.status(200).json({
        message: "USer account is disabled, please contact admin",
        status: 400,
      });
    }

    return response.status(200).json({
      message: "User Signin successful, please login to continue",
      status: 200,
      user: loggedInUser,
    });
  }
  return response.status(200).json({
    message: "Invalid data, please give proper data and try again",
    status: "400",
  });
};
