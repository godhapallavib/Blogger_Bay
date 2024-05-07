import { Request, Response } from "express";
import { User } from "../models/User";
import { readUsersData, writeIntoUser } from "../utils/fileUtils";

export const disableUser = (request: Request, response: Response) => {
  const { user_name, user_id } = request.body;
  console.log(user_name, user_id);
  if (!user_name || !user_id) {
    return response.status(200).json({
      message: "Username, user_id are required!",
      status: 400,
    });
  }
  if (user_name && user_id) {
    const users: User[] = readUsersData();
    const user = users.filter((user) => user.user_id === user_id);
    user[0].isDisabled = true;
    writeIntoUser(users);
    return response.status(200).json({
      message: "User successfully disable",
      status: 200,
    });
  }
  return response.status(200).json({
    message: "unable to diable the user, please login later",
    status: "400",
  });
};
