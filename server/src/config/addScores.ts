/**
 * This file is a one-time script to add scores to the posts.
 */

import dotenv from "dotenv";
import mongoConnection from "./mongo";
import { IComment } from "../models/Comment";
import Post from "../models/Post";

// Load environment variables from .env file
dotenv.config();
if (!process.env.MONGODB_URI) {
  console.error("Required environment variables are missing! Exiting...");
  process.exit(1);
}

// Setup MongoDB
mongoConnection();

// For each post, the score should be 3 times the number of reactions + 3 times the number of non-anonymous comments + 2 times the number of anonymous comments + 1 times the number of reactions on comments
const addScores = async () => {
  console.time("fullTask");

  console.time("getPosts");
  const posts = await Post.find({}).populate("comments");
  console.timeEnd("getPosts");

  const promises = [];

  console.time("buildPromises");

  for (const post of posts) {
    let score = 0;

    // Add 3 points for reactions
    score += post.reactions.reduce((acc, list) => acc + list.length, 0) * 3;

    // Add 2 or 3 points for comments
    score += post.comments.reduce(
      (acc: number, comment: IComment) => acc + (comment.author ? 1.5 : 0.75),
      0
    );

    // Add 1 point for reactions on comments
    score += post.comments.reduce(
      (acc: number, comment: IComment) =>
        acc +
        comment.reactions.reduce((acc2, list) => acc2 + list.length * 0.25, 0),
      0
    );

    post.score = score;
    promises.push(post.save());
  }

  console.timeEnd("buildPromises");

  return Promise.all(promises).then(() => console.timeEnd("fullTask"));
};

addScores()
  .then(() => console.log("Success!"))
  .catch((err) => console.error(err));
