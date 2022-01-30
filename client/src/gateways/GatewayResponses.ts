export interface IResponse<T> {
  message: string;
  payload: T | null;
  success: boolean;
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
