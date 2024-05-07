import { Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";
import {
  readBlogsData,
  readUsersData,
  writeIntoBlog,
} from "../utils/fileUtils";
import { User } from "../models/User";
import { Blog } from "../models/Blog";
import { addPostToElasticSearch } from "../elastic-search/elasticServer";

export const createBlog = (request: Request, response: Response) => {
  const { title, description, image_url, category, user_id } = request.body;

  if (!title || !user_id || !category) {
    return response.status(200).json({
      message: "title, category and user login is needed!",
      status: 400,
    });
  }
  if (title && category && user_id) {
    const users: User[] = readUsersData() || [];
    const blogs: Blog[] = readBlogsData();
    const user = users.find((user) => user.user_id === user_id);
    const blog: Blog = {
      username: user?.username || "Anonymus",
      id: uuidv4(),
      title,
      imageUrl: image_url,
      blogCreatedDate: new Date(),
      description,
      comments: [],
      category: category,
    };
    blogs.push(blog);
    addPostToElasticSearch(blog);
    writeIntoBlog(blogs);
    return response.status(200).json({
      message: "Blog is created successfully",
      status: 200,
    });
  }
  return response.status(200).json({
    message: "Invalid data, please give proper data and try again",
    status: "400",
  });
};
