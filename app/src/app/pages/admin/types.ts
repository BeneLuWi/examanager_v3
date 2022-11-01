export interface User {
  _id: string
  username: string
  role: number
}

export interface AdminContextType {
  users?: User[]
  updateUsers: VoidFunction
}
