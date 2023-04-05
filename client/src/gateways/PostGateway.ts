import axios from "axios";
import { IReport } from "types/IReport";
import IUser from "../types/IUser";
import IComment from "../types/IComment";
import IPost, { IPostReactions } from "../types/IPost";
import {
  failureResponseFromError,
  IResponse,
  successfulResponse,
} from "./GatewayResponses";

export async function getPosts(
  page?: number,
  sort?: "hot" | "new" | "topAllTime" | "topWeek" | "topMonth" | "default"
): Promise<IResponse<IPost[]>> {
  try {
    const response = await axios.get("/posts", {
      params: {
        page,
        sort,
      },
    });
    return successfulResponse(response.data as IPost[]);
  } catch (error: unknown) {
    return failureResponseFromError(error);
  }
}

export async function getAllPosts(page?: number): Promise<IResponse<IPost[]>> {
  // only for moderators! gets all posts, regardless of approval or review status
  try {
    const response = await axios.get(`/posts/all`, {
      params: { page },
    });
    return successfulResponse(response.data as IPost[]);
  } catch (error: unknown) {
    return failureResponseFromError(error);
  }
}

export async function getModFeedPosts(
  page?: number
): Promise<IResponse<IPost[]>> {
  // only for moderators! gets posts that need moderation
  try {
    const response = await axios.get(`/posts/mod-feed`, {
      params: { page },
    });
    return successfulResponse(response.data as IPost[]);
  } catch (error: unknown) {
    return failureResponseFromError(error);
  }
}

export async function getModFeedComments(
  page?: number
): Promise<IResponse<IComment[]>> {
  // only for moderators! gets comments that need moderation
  try {
    const response = await axios.get(`/posts/mod-feed/comments`, {
      params: { page },
    });
    return successfulResponse(response.data as IComment[]);
  } catch (error: unknown) {
    return failureResponseFromError(error);
  }
}

export async function getPost(postNumber: number): Promise<IResponse<IPost>> {
  try {
    const response = await axios.get(`/posts/${postNumber}`);
    return successfulResponse(response.data as IPost);
  } catch (error: unknown) {
    return failureResponseFromError(error);
  }
}

export async function createPost(content: string): Promise<IResponse<IPost>> {
  try {
    const response = await axios.post("/posts", { content });
    return successfulResponse(response.data as IPost);
  } catch (error: unknown) {
    return failureResponseFromError(error);
  }
}

export async function createImagePost(
  title: string,
  imageUrl: string
): Promise<IResponse<IPost>> {
  // image url must be on i.imgur.com
  try {
    const response = await axios.post("/posts/image", { title, imageUrl });
    return successfulResponse(response.data as IPost);
  } catch (error: unknown) {
    return failureResponseFromError(error);
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
    return failureResponseFromError(error);
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
    return failureResponseFromError(error);
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
    return failureResponseFromError(error);
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
    return failureResponseFromError(error);
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
    return failureResponseFromError(error);
  }
}

export async function searchPosts(query: string): Promise<IResponse<IPost[]>> {
  try {
    const response = await axios.get(`/posts/search?query=${query}`);
    return successfulResponse(response.data as IPost[]);
  } catch (error: unknown) {
    return failureResponseFromError(error);
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
    return failureResponseFromError(error);
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
    return failureResponseFromError(error);
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
    return failureResponseFromError(error);
  }
}

export async function getPostReactionsByPage(
  page?: number
): Promise<IResponse<IPostReactions[]>> {
  try {
    const response = await axios.get(`/posts/reactions`, {
      params: { page },
    });
    return successfulResponse(response.data as IPostReactions[]);
  } catch (error: unknown) {
    return failureResponseFromError(error);
  }
}

export async function getPostReactionsByPost(
  postNumber: number
): Promise<IResponse<IPostReactions>> {
  try {
    const response = await axios.get(`/posts/${postNumber}/reactions`);
    return successfulResponse(response.data as IPostReactions);
  } catch (error: unknown) {
    return failureResponseFromError(error);
  }
}

export async function getModFeedReports(
  page?: number
): Promise<IResponse<IReport[]>> {
  try {
    const response = await axios.get(`/posts/mod-feed/reports`, {
      params: { page },
    });
    return successfulResponse(response.data as IReport[]);
  } catch (error: unknown) {
    return failureResponseFromError(error);
  }
}

export async function flagComment(
  postNumber: number,
  commentNumber: number,
  reason: string
): Promise<IResponse<boolean>> {
  try {
    const response = await axios.post(
      `/posts/${postNumber}/comment/${commentNumber}/flag`,
      { reason }
    );
    const data = response.data as { success: boolean };
    return successfulResponse(data.success);
  } catch (error: unknown) {
    return failureResponseFromError(error);
  }
}

export async function resolveReport(
  postNumber: number,
  commentNumber: number
): Promise<IResponse<IReport>> {
  try {
    const response = await axios.put(
      `/posts/${postNumber}/comment/${commentNumber}/resolve`
    );
    return successfulResponse(response.data as IReport);
  } catch (error: unknown) {
    return failureResponseFromError(error);
  }
}

export async function getAllPostNumbers(): Promise<
  IResponse<(number | string)[]>
> {
  try {
    const response = await axios.get(`/posts/numbers`);
    return successfulResponse(response.data as (number | string)[]);
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}
