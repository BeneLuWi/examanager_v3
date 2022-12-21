export interface SchoolClass {
  _id: string
  name: string
  description: string
  owner_id: string
}

export type Student = {
  _id: string
  firstname: string
  lastname: string
  user_id: string
  school_class_id: string
  gender: Gender
}

export enum Gender {
  m = "m",
  w = "w",
  d = "d",
}
