import { Request, Response } from "express";
import { readBlogsData, writeIntoBlog } from "../utils/fileUtils";
import { Blog } from "../models/Blog";
import { removePostFromElasticSearch } from "../elastic-search/elasticServer";

export const deleteBlog = (request: Request, response: Response) => {
  const { blog_id, role } = request.body;

  if (!blog_id || !role) {
    return response.status(200).json({
      message: "Something went wrong,please try again later!",
      status: 400,
    });
  }
  if (blog_id && role) {
    const blogs: Blog[] = readBlogsData();
    const blogIndex = blogs.findIndex((blog) => blog.id == blog_id) ?? -1;
    console.log(blogs, blog_id, blogIndex, role);
    if (blogIndex == -1) {
      return response.status(200).json({
        message: "Blog not found",
        status: 400,
      });
    }
    if (role != "admin" && role != "moderator") {
      return response.status(200).json({
        message: "Action cannot be performed by you",
        status: 400,
      });
    }
    removePostFromElasticSearch(blog_id);
    if (blogIndex !== -1) {
      blogs.splice(blogIndex, 1);
    }

    writeIntoBlog(blogs);
    return response.status(200).json({
      message: "Blog is deleted successfully",
      status: 200,
    });
  }
  return response.status(200).json({
    message: "Something went wrong",
    status: "400",
  });
};
