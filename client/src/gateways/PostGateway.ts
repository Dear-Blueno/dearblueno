import axios from "axios";
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

export async function getPost(id: number): Promise<IResponse<IPost>> {
  try {
    const response = await axios.get(`/posts/${id}`);
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
  postId: number,
  reaction: number,
  status: boolean
): Promise<IResponse<IPost>> {
  try {
    const response = await axios.put(`/posts/${postId}/react`, {
      reaction,
      status,
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
  postId: number,
  content: string,
  parentId: number
): Promise<IResponse<IPost>> {
  try {
    const response = await axios.post(`/posts/${postId}/comment`, {
      content,
      parentId,
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
  postId: number,
  commentId: number,
  reaction: number,
  status: boolean
): Promise<IResponse<IPost>> {
  try {
    const response = await axios.put(
      `/posts/${postId}/comment/${commentId}/react`,
      {
        reaction,
        status,
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
  postId: number,
  approved: boolean
): Promise<IResponse<IPost>> {
  try {
    const response = await axios.put(`/posts/${postId}/approve`, { approved });
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
