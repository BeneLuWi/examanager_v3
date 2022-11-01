export interface SchoolClass {
  _id: string
  name: string
  owner_id: string
}

export interface SchoolClassContextType {
  schoolClasses?: SchoolClass[]
  updateSchoolClasses: VoidFunction
}
