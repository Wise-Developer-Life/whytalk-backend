export interface CommonResponse<T> {
  message: string;
  data?: T;
}

export type EmptyResponse = CommonResponse<null>;
