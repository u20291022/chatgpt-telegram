export interface User {
  isAdmin: boolean,
  isAuthorized: boolean
}

export interface Users {
  [id: string]: User
}

export type Token = string;
export type TokenData = User;
export interface Tokens {
  [token: string]: TokenData
}