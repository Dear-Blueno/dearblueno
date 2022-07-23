import axios from "axios";
import IComment from "types/IComment";
import IPost from "types/IPost";
import IUser, { IBasicUser } from "../types/IUser";
import {
  failureResponse,
  IResponse,
  successfulResponse,
} from "./GatewayResponses";

export async function getUser(_id: string): Promise<IResponse<IBasicUser>> {
  try {
    const response = await axios.get(`/user/${_id}`);
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data as string);
    }
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function searchUsers(
  query: string
): Promise<IResponse<IBasicUser[]>> {
  try {
    const response = await axios.get(`/user/search/${query}`);
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data as string);
    }
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function updateUserProfile(
  bio?: string,
  hometown?: string,
  instagram?: string,
  twitter?: string,
  facebook?: string,
  linkedin?: string,
  concentration?: string,
  classYear?: string
): Promise<IResponse<IUser>> {
  try {
    const response = await axios.put(`/user/profile`, {
      bio,
      hometown,
      instagram,
      twitter,
      facebook,
      linkedin,
      concentration,
      classYear,
    });
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data as string);
    }
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function updateProfilePicture(
  profilePicture: string // profile picture url must be on i.imgur.com
): Promise<IResponse<IUser>> {
  try {
    const response = await axios.put(`/user/profilePicture`, {
      profilePicture,
    });
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data as string);
    }
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function banUser(
  _id: string,
  banLengthMinutes: number // set to 0 to unban
): Promise<IResponse<IUser>> {
  try {
    const response = await axios.put(`/user/ban`, {
      id: _id,
      duration: banLengthMinutes,
    });
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data as string);
    }
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function getUserComments(
  _id: string
): Promise<IResponse<IComment[]>> {
  try {
    const response = await axios.get(`/user/${_id}/comments`);
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data as string);
    }
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function getBookmarks(page: number): Promise<IResponse<IPost[]>> {
  try {
    const response = await axios.get(`/user/bookmarks?page=${page}`);
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data as string);
    }
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function deleteNotification(
  notificationId: string
): Promise<IResponse<IUser>> {
  try {
    const response = await axios.delete(
      `/user/notifications/${notificationId}`
    );
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data as string);
    }
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}
