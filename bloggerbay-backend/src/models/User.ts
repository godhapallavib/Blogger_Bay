import { ApiResponse } from "./Response";

export interface User {
  username: string;
  user_id: string;
  password: string;
  role: string; //can be updated to enum in future
  isDisabled: boolean;
}

export interface UserResponse extends ApiResponse {
  users: Omit<User, "password">[];
}
