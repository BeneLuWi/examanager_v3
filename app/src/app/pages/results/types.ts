import { Exam } from "../exams/types"
import { SchoolClass } from "../school_classes/types"

export interface Result {
  owner_id: string
  student_id: string
  exam_id: string
  points_per_task: []
}

export interface ResultContextType {
  exam?: Exam
  schoolClass?: SchoolClass
}

export interface TaskPoint {}
