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

export interface UpdateUserInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}
