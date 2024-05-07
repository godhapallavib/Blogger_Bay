import express from "express";
import { signUp } from "./src/api/signUp";
import { disableUser } from "./src/api/disableUser";
import { createBlog } from "./src/api/createBlog";
import { deleteBlog } from "./src/api/deleteBlog";
import { signIn } from "./src/api/signin";
import { addComment } from "./src/api/addComment";
import cors from "cors";
import bodyParser from "body-parser";
import {
  readBlogsData,
  readSubscriptionsData,
  readUsersData,
} from "./src/utils/fileUtils";
import { addSubscription } from "./src/api/addSubscription";
import { deleteSubscription } from "./src/api/deleteSubscription";
import { updateSubscription } from "./src/api/updateSubscription";
import {
  createBlogIndex,
  getAllBlogs,
} from "./src/elastic-search/elasticServer";
import { searchText } from "./src/api/searchPost";
import { getRecommendations } from "./src/api/getReccomendations";

const app = express();
app.use(bodyParser.json());
const port = 8888;

app.use(cors());
createBlogIndex("blogs");
app.post("/signup", signUp);
app.post("/signin", signIn);
app.post("/createblog", createBlog);
app.post("/deleteblog", deleteBlog);
app.post("/disableuser", disableUser);
app.post("/addcomment", addComment);
app.post("/addsubscription", addSubscription);
app.post("/deletesubscription", deleteSubscription);
app.post("/updatesubscription", updateSubscription);
app.post("/search", searchText);
app.get("/recommendations", getRecommendations);

app.get("/blogs", (req, res) => {
  const blogs = readBlogsData();
  getAllBlogs();
  return res.status(200).json(blogs);
});
app.get("/users", (req, res) => {
  const users = readUsersData();
  return res.status(200).json(users);
});

app.get("/subscriptions", (req, res) => {
  const subscriptions = readSubscriptionsData();
  return res.status(200).json(subscriptions);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
