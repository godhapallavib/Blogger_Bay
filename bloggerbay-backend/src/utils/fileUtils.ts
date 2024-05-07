import { readFileSync, writeFileSync } from "fs";
import { User } from "../models/User";
import { Blog } from "../models/Blog";
import { Subscription } from "../models/Subscription";

export const readUsersData = (): User[] => {
  console.log(process.cwd());
  console.log(__dirname);
  var fileData: string = readFileSync(__dirname + "/../data/users.json", {
    encoding: "utf-8",
  });
  var jsonData = JSON.parse(fileData);
  return jsonData;
};

export const readBlogsData = (): Blog[] => {
  var fileData: string = readFileSync(__dirname + "/../data/blogs.json", {
    encoding: "utf-8",
  });
  var jsonData = JSON.parse(fileData);
  return jsonData;
};

export const writeIntoBlog = (blogs: Blog[]) => {
  writeFileSync(__dirname + "/../data/blogs.json", JSON.stringify(blogs));
};

export const writeIntoUser = (users: User[]) => {
  writeFileSync(__dirname + "/../data/users.json", JSON.stringify(users));
};

export const readSubscriptionsData = (): Subscription[] => {
  var fileData: string = readFileSync(
    __dirname + "/../data/subscriptions.json",
    {
      encoding: "utf-8",
    }
  );
  var jsonData = JSON.parse(fileData);
  return jsonData;
};

export const writeIntoSubscriptions = (subscriptions: Subscription[]) => {
  writeFileSync(
    __dirname + "/../data/subscriptions.json",
    JSON.stringify(subscriptions)
  );
};
