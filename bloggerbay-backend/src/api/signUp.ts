import { Request, Response } from "express";
import { User } from "../models/User";
import { v4 as uuidv4 } from "uuid";
import { readUsersData, writeIntoUser } from "../utils/fileUtils";
import crypto from "crypto";
import bcrypt from "bcrypt";

const hashPassword = (password: string) => {
  const hash = crypto
    .pbkdf2Sync(password, "mySecret", 10000, 64, "sha512")
    .toString("hex");
  return hash;
};

export const signUp = async (request: Request, response: Response) => {
  const { username, password, role } = request.body;
  if (!username || !password || !role) {
    return response.status(200).json({
      message: "Username, password and role are required!",
      status: 400,
    });
  }
  if (username && password && role) {
    const users: User[] = readUsersData() || [];
    const isAlreadyAUser = users.findIndex(
      (user) => username === user.username
    );
    if (isAlreadyAUser !== -1) {
      return response.status(200).json({
        message: "Username already exisits",
        status: "400",
      });
    }
    const user: User = {
      username,
      password: await bcrypt.hash(password, 10),
      role,
      isDisabled: false,
      user_id: uuidv4(),
    };

    users.push(user);
    writeIntoUser(users);
    return response.status(200).json({
      message: "USer Signup successful, please login to continue",
      status: 200,
    });
  }
  return response.status(200).json({
    message: "Invalid data, please give proper data and try again",
    status: "400",
  });
};
