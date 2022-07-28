import axios from "axios";
import IUser from "types/IUser";
import IComment from "../types/IComment";
import IPost, { IPostReactions } from "../types/IPost";
import {
  failureResponse,
  IResponse,
  successfulResponse,
} from "./GatewayResponses";

export async function getPosts(page: number): Promise<IResponse<IPost[]>> {
  try {
    const response = await axios.get(`/posts?page=${page}`);
    return successfulResponse(response.data as IPost[]);
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function getAllPosts(page: number): Promise<IResponse<IPost[]>> {
  // only for moderators! gets all posts, regardless of approval or review status
  try {
    const response = await axios.get(`/posts/all?page=${page}`);
    return successfulResponse(response.data as IPost[]);
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function getModFeedPosts(
  page: number
): Promise<IResponse<IPost[]>> {
  // only for moderators! gets posts that need moderation
  try {
    const response = await axios.get(`/posts/mod-feed?page=${page}`);
    return successfulResponse(response.data as IPost[]);
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function getModFeedComments(
  page: number
): Promise<IResponse<IComment[]>> {
  // only for moderators! gets comments that need moderation
  try {
    const response = await axios.get(`/posts/mod-feed/comments?page=${page}`);
    return successfulResponse(response.data as IComment[]);
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function getPost(postNumber: number): Promise<IResponse<IPost>> {
  try {
    const response = await axios.get(`/posts/${postNumber}`);
    return successfulResponse(response.data as IPost);
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function createPost(content: string): Promise<IResponse<IPost>> {
  try {
    const response = await axios.post("/posts", { content });
    return successfulResponse(response.data as IPost);
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function reactToPost(
  postNumber: number,
  reaction: number,
  state: boolean
): Promise<IResponse<boolean>> {
  try {
    const response = await axios.put(`/posts/${postNumber}/react`, {
      reaction,
      state,
    });
    const data = response.data as { reaction: boolean };
    return successfulResponse(data.reaction);
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function commentOnPost(
  postNumber: number,
  content: string,
  parentCommentNumber: number,
  anonymous?: boolean
): Promise<IResponse<IComment>> {
  try {
    const response = await axios.post(`/posts/${postNumber}/comment`, {
      content,
      parentId: parentCommentNumber,
      anonymous,
    });
    return successfulResponse(response.data as IComment);
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function reactToComment(
  postNumber: number,
  commentNumber: number,
  reaction: number,
  state: boolean
): Promise<IResponse<boolean>> {
  try {
    const response = await axios.put(
      `/posts/${postNumber}/comment/${commentNumber}/react`,
      {
        reaction,
        state,
      }
    );
    const data = response.data as { reaction: boolean };
    return successfulResponse(data.reaction);
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function approvePost(
  postId: string,
  approved: boolean,
  contentWarning?: string
): Promise<IResponse<IPost>> {
  try {
    const response = await axios.put(`/posts/${postId}/approve`, {
      approved,
      contentWarning,
    });
    return successfulResponse(response.data as IPost);
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function approveComment(
  postNumber: number,
  commentNumber: number,
  approved: boolean
): Promise<IResponse<IPost>> {
  try {
    const response = await axios.put(
      `/posts/${postNumber}/comment/${commentNumber}/approve`,
      { approved }
    );
    return successfulResponse(response.data as IPost);
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function searchPosts(query: string): Promise<IResponse<IPost[]>> {
  try {
    const response = await axios.get(`/posts/search?query=${query}`);
    return successfulResponse(response.data as IPost[]);
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function deleteComment(
  postNumber: number,
  commentNumber: number
): Promise<IResponse<boolean>> {
  try {
    const response = await axios.delete(
      `/posts/${postNumber}/comment/${commentNumber}`
    );
    const data = response.data as { success: boolean };
    return successfulResponse(data.success);
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function bookmarkPost(
  postNumber: number,
  bookmark: boolean
): Promise<IResponse<IUser>> {
  try {
    const response = await axios.post(`/posts/${postNumber}/bookmark`, {
      bookmark,
    });
    return successfulResponse(response.data as IUser);
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function subscribeToPost(
  postNumber: number,
  subscribe: boolean
): Promise<IResponse<boolean>> {
  try {
    const response = await axios.post(`/posts/${postNumber}/subscribe`, {
      subscribe,
    });
    const data = response.data as { subscribed: boolean };
    return successfulResponse(data.subscribed);
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function getPostReactionsByPage(
  page: number
): Promise<IResponse<IPostReactions[]>> {
  try {
    const response = await axios.get(`/posts/reactions?page=${page}`);
    return successfulResponse(response.data as IPostReactions[]);
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function getPostReactionsByPost(
  postNumber: number
): Promise<IResponse<IPostReactions>> {
  try {
    const response = await axios.get(`/posts/${postNumber}/reactions`);
    return successfulResponse(response.data as IPostReactions);
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}
