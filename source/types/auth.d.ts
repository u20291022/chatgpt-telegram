export interface User {
  name: string,
  token: string,
  admin?: boolean,
  authorized?: boolean;
}

export interface Users {
  [id: string]: User
}