import { Exam } from "../exams/types"
import { SchoolClass } from "../school_classes/types"
import React, { Dispatch, SetStateAction } from "react"

export interface Result {
  owner_id: string
  student_id: string
  exam_id: string
  points_per_task: []
}

export interface ResultContextType {
  exam?: Exam
  schoolClass?: SchoolClass
  setExam: Dispatch<SetStateAction<Exam | undefined>>
  setSchoolClass: Dispatch<SetStateAction<SchoolClass | undefined>>
}

export interface TaskPoint {}
