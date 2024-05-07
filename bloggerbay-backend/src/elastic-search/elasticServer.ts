import { Client } from "@elastic/elasticsearch";
import { Blog } from "../models/Blog";

const client = new Client({ node: "http://localhost:9200" });

const defaultBlog1 = {
  username: "demouser2",
  id: "85b2a9b2-d44d-4a08-9d2e-9ad9b23e3263",
  title: "Sea",
  imageUrl:
    "https://media.istockphoto.com/id/1442179368/photo/maldives-island.webp?b=1&s=170667a&w=0&k=20&c=i8wK-BoIq_B365rf0oMRBNmuMc4U1zlTUllMuyr_QNw=",
  blogCreatedDate: new Date(),
  description:
    "A sea is a large body of salty water. There are particular seas and the sea. The sea commonly refers to the ocean, the wider body of seawater. Particular seas are either marginal seas, second-order sections of the oceanic sea (e.g. the Mediterranean Sea), or certain large, nearly landlocked bodies of water.   T",
  comments: [{ reply: "commenting" }],
  category: "Travel",
};

const defaultBlog2 = {
  username: "demouser2",
  id: "cfd06c42-faf1-4bfe-8de8-0191768ce8c9",
  title: "Campus services",
  imageUrl:
    "https://www.admitkard.com/blog/wp-content/uploads/2018/01/Illinois-Institute-of-Technology-Chicago-Reviews-Ratings-Application-Fees.jpg",
  blogCreatedDate: new Date(),
  description:
    "Usually a college campus includes libraries, lecture halls, residence halls, student centers or dining halls, and park-like settings. A modern campus is a collection of buildings and grounds that belong to a given institution, either academic or non-academic.",
  comments: [{ reply: "new comment" }],
  category: "Campus Culture",
};

export const createBlogIndex = async (indexName: string) => {
  try {
    const indexExists = await client.indices.exists({ index: indexName });
    if (!indexExists) {
      await client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              title: { type: "text" },
              id: { type: "keyword" },
              imageUrl: { type: "text" },
              description: { type: "text" },
              comments: {
                type: "nested",
                properties: {
                  reply: { type: "text" },
                },
              },
              category: { type: "keyword" },
              username: { type: "keyword" },
              blogCreatedDate: { type: "date" },
            },
          },
        },
      });
      addPostToElasticSearch(defaultBlog1);
      addPostToElasticSearch(defaultBlog2);
      console.log(
        `Index '${indexName}' created successfully using elastic search .`
      );
    } else {
      console.log(
        `You are succesfully connected to elastic search and using it.`
      );
    }
  } catch (error) {
    console.error(`Error creating index '${indexName}':`, error);
  }
};

export const addPostToElasticSearch = async (post: Blog) => {
  try {
    // Index the blog post document into the "blogs" index
    await client.index({
      index: "blogs",
      body: post,
    });
    console.log("Blog post indexed successfully:");
  } catch (error) {
    console.error("Error indexing blog post:", error);
  }
};

export const removePostFromElasticSearch = async (postId: string) => {
  try {
    // Delete the blog post document from the "blogs" index
    await client.delete({
      index: "blogs",
      id: postId,
    });
    console.log("Blog post removed successfully:");
  } catch (error) {
    console.error("Error removing blog post:", error);
  }
};

export const getAllBlogs = async () => {
  const result = await client.search({
    index: "blogs",
    query: {
      match_all: {},
    },
  });
};

export const searchBlogsByTitle = async (searchItem: string) => {
  const response = await client.search({
    index: "blogs",
    body: {
      query: {
        match: {
          title: {
            query: searchItem,
          },
        },
      },
    },
  });

  const searchResults = response.hits.hits.map((hit) => hit._source) ?? [];
  return searchResults;
};
