export interface RegisterRequest {
  _id: string;
  userId: string;
  email: string;
  name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
