import axios from "axios";
import IUser from "../types/IUser";
import {
  failureResponse,
  IResponse,
  successfulResponse,
} from "./GatewayResponses";

// loadAuth: Checks if the user is logged in or not
export async function loadAuth(): Promise<IResponse<IUser>> {
  try {
    const response = await axios.get("/auth/login/success");
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data);
    }
  } catch (error: any) {
    return failureResponse(error);
  }
}

// logout: Logs out and redirects to the home page
export function logout() {
  window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
}

// loginBrown: Only allows Brown.edu users to login with Google
// Redirects to the login page, then redirects back to the home page
export function loginBrown() {
  window.open(`${process.env.REACT_APP_API_URL}/auth/login`, "_self");
}

// loginUnverified: Allows any user to login with Google
// Redirects to the login page, then redirects back to the home page
export function loginUnverified() {
  window.open(
    `${process.env.REACT_APP_API_URL}/auth/login/unverified`,
    "_self"
  );
}
