import { Request, Response } from "express";
import { searchBlogsByTitle } from "../elastic-search/elasticServer";

export const searchText = async (request: Request, response: Response) => {
  const { title } = request.body;
  if (!title) {
    return response.status(200).json({
      message: "title is needed",
      status: 400,
    });
  }
  const searchedFields = await searchBlogsByTitle(title);

  return response.status(200).json({
    message: "Valid data",
    status: 200,
    blogs: searchedFields || [],
  });
};
