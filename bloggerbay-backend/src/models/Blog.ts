import { ApiResponse } from "./Response";

export interface Blog {
  title: string;
  id: string;
  imageUrl: string;
  description: string;
  comments: Comment[];
  category: string; // Need to update to enum in future
  username: string;
  blogCreatedDate: Date;
}

export interface Comment {
  reply: string;
}

export interface BlogResponse extends ApiResponse {
  blogs: Blog[];
}
