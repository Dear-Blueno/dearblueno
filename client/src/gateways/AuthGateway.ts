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
    const response = await axios.get("/auth");
    if (response.status === 200) {
      const data = response.data as { user: IUser };
      return successfulResponse(data.user);
    } else {
      const data = response.data as { message: string };
      return failureResponse(data.message);
    }
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

// logout: Logs out and redirects to the home page
export function logout() {
  window.open(
    `${
      process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:5000"
    }/auth/logout`,
    "_self"
  );
}

// loginBrown: Only allows Brown.edu users to login with Google
// Redirects to the login page, then redirects back to the home page
export function loginBrown() {
  window.open(
    `${process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:5000"}/auth/login`,
    "_self"
  );
}

// loginUnverified: Allows any user to login with Google
// Redirects to the login page, then redirects back to the home page
export function loginUnverified() {
  window.open(
    `${
      process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:5000"
    }/auth/login/unverified`,
    "_self"
  );
}
