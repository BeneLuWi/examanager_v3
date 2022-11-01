export type AuthInfo = {
  username: string
  role: number
  token: string
}

export type AuthContextType = {
  signIn: (name: string, password: string, success: VoidFunction, failure: VoidFunction) => void
  signOut: (callback: VoidFunction) => void
  auth?: AuthInfo
}

export enum Roles {
  "USER" = 0,
  "ADMIN" = 1,
}
