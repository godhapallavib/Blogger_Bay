import { Request, Response } from "express";
import { readBlogsData, writeIntoBlog } from "../utils/fileUtils";
import { Blog } from "../models/Blog";

export const addComment = (request: Request, response: Response) => {
  const { message, blog_id } = request.body;
  if (!message || !blog_id) {
    return response.status(200).json({
      message: "message, postid are required!",
      status: 400,
    });
  }
  if (message && blog_id) {
    const blogs: Blog[] = readBlogsData();
    const blogIndex = blogs.findIndex((blog) => blog.id == blog_id) ?? -1;
    if (blogIndex == -1) {
      return response.status(200).json({
        message: "Blog not found to add a reply",
        status: 400,
      });
    }
    blogs[blogIndex].comments.push({ reply: message });
    writeIntoBlog(blogs);
    return response.status(200).json({
      message: "Comment added successfully",
      status: 200,
    });
  }
  return response.status(200).json({
    message: "Unable to add a comment, please try again later",
    status: "400",
  });
};
