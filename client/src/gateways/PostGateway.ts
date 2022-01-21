import axios from "axios";
import IComment from "../types/IComment";
import IPost from "../types/IPost";
import {
  failureResponse,
  IResponse,
  successfulResponse,
} from "./GatewayResponses";

export async function getPosts(page: number): Promise<IResponse<IPost[]>> {
  try {
    const response = await axios.get(`/posts?page=${page}`);
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
  }
}

export async function getAllPosts(page: number): Promise<IResponse<IPost[]>> {
  // only for moderators! gets all posts, regardless of approval or review status
  try {
    const response = await axios.get(`/posts/all?page=${page}`);
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
  }
}

export async function getModFeedPosts(
  page: number
): Promise<IResponse<IPost[]>> {
  // only for moderators! gets posts that need moderation
  try {
    const response = await axios.get(`/posts/mod-feed?page=${page}`);
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
  }
}

export async function getModFeedComments(
  page: number
): Promise<IResponse<IComment[]>> {
  // only for moderators! gets comments that need moderation
  try {
    const response = await axios.get(`/posts/mod-feed/comments?page=${page}`);
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
  }
}

export async function getPost(postNumber: number): Promise<IResponse<IPost>> {
  try {
    const response = await axios.get(`/posts/${postNumber}`);
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
  }
}

export async function createPost(content: string): Promise<IResponse<IPost>> {
  try {
    const response = await axios.post("/posts", { content });
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
  }
}

export async function reactToPost(
  postNumber: number,
  reaction: number,
  state: boolean
): Promise<IResponse<IPost>> {
  try {
    const response = await axios.put(`/posts/${postNumber}/react`, {
      reaction,
      state,
    });
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
  }
}

export async function commentOnPost(
  postNumber: number,
  content: string,
  parentCommentNumber: number,
  anonymous?: boolean
): Promise<IResponse<IPost>> {
  try {
    const response = await axios.post(`/posts/${postNumber}/comment`, {
      content,
      parentId: parentCommentNumber,
      anonymous,
    });
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
  }
}

export async function reactToComment(
  postNumber: number,
  commentNumber: number,
  reaction: number,
  state: boolean
): Promise<IResponse<IPost>> {
  try {
    const response = await axios.put(
      `/posts/${postNumber}/comment/${commentNumber}/react`,
      {
        reaction,
        state,
      }
    );
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
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
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
  }
}

export async function approveComment(
  postId: number,
  commentId: number,
  approved: boolean
): Promise<IResponse<IPost>> {
  try {
    const response = await axios.put(
      `/posts/${postId}/comment/${commentId}/approve`,
      { approved }
    );
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
  }
}

export async function searchPosts(query: string) {
  try {
    const response = await axios.get(`/posts/search?query=${query}`);
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
  }
}

export async function getPostReactions(
  postNumber: number
): Promise<IResponse<{ _id: string; name: string }[][]>> {
  try {
    const response = await axios.get(`/posts/${postNumber}/reactions`);
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
  }
}

export async function getCommentReactions(
  postNumber: number,
  commentNumber: number
): Promise<IResponse<{ _id: string; name: string }[][]>> {
  try {
    const response = await axios.get(
      `/posts/${postNumber}/comments/${commentNumber}/reactions`
    );
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
  }
}
