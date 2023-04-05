import { AxiosError } from "axios";

export type IResponse<T> = ISuccessfulResponse<T> | IFailureResponse;

interface ISuccessfulResponse<T> {
  message: "OK";
  payload: T;
  success: true;
}

interface IFailureResponse {
  message: string;
  payload: null;
  success: false;
}

export function successfulResponse<T>(payload: T): ISuccessfulResponse<T> {
  return {
    message: "OK",
    payload: payload,
    success: true,
  };
}

export function failureResponse(message: string): IFailureResponse {
  return {
    message: message,
    payload: null,
    success: false,
  };
}

export function failureResponseFromError(error: unknown): IFailureResponse {
  if (!(error instanceof AxiosError)) {
    return failureResponse(error as string);
  }
  const axiosError = error as AxiosError;
  let message = axiosError.message;
  if (axiosError.response?.statusText) {
    message += ` (${axiosError.response.statusText})`;
  }
  return failureResponse(message);
}
