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

export function successfulResponse<T>(payload: T): IResponse<T> {
  return {
    message: "OK",
    payload: payload,
    success: true,
  };
}

export function failureResponse<T>(message: string): IResponse<T> {
  return {
    message: message,
    payload: null,
    success: false,
  };
}
