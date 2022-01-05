import axios from "axios";
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
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
  }
}

export async function getUsersNames(
  ids: string[]
): Promise<IResponse<IBasicUser[]>> {
  try {
    // include array of ids in request body
    const response = await axios.get("/user/names", { data: { ids } });
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
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
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
  }
}

export async function updateUserProfile(
  bio?: string,
  instagram?: string,
  twitter?: string,
  facebook?: string,
  concentration?: string,
  classYear?: string
): Promise<IResponse<IUser>> {
  try {
    const response = await axios.put(`/user/profile`, {
      bio,
      instagram,
      twitter,
      facebook,
      concentration,
      classYear,
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
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
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
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
  }
}
