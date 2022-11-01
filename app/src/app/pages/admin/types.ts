export interface User {
  id: string
  username: string
  role: number
}

export interface AdminContextType {
  users?: User[]
  updateUsers: VoidFunction
}
