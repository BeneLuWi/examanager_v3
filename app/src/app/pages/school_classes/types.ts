export interface SchoolClass {
  _id: string
  name: string
  description: string
  owner_id: string
}

export type Student = {
  id: string
  firstname: string
  lastname: string
  user_id: string
  schoolclass_id: string
}

export interface SchoolClassContextType {
  schoolClasses?: SchoolClass[]
  updateSchoolClasses: VoidFunction
}
