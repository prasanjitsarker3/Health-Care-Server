export type ILogin = {
  email: string;
  password: string;
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type ITokenUser = {
  id: string;
  email: string;
  role: string;
  iat: string;
  exp: string;
};
