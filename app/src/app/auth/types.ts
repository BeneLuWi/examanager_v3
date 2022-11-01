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
  "VISITOR" = 0,
  "USER" = 1,
  "EDITOR" = 2,
  "ADMIN" = 3,
}
