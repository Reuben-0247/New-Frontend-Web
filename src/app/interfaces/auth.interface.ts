export interface IAuth {
  token: string;
  role: string;
  message: string;
  id: string;
}

export interface ChangePasswordInput {
  id: string;
  oldPassword: string;
  password: string;
}
