import { Exam, Task } from "../exams/types"
import { SchoolClass, Student } from "../school_classes/types"
import React, { SetStateAction } from "react"

export interface Result {
  owner_id: string
  student_id: string
  exam_id: string
  points_per_task: []
}

export interface ResultContextType {
  exam?: Exam
  schoolClass?: SchoolClass

  setExam: React.Dispatch<SetStateAction<Exam | undefined>>
}

export interface ExamResultsResponse {
  school_class_id: string
  exam: Exam
  studentResults: StudentResultsResponse[]
}

export interface StudentResultsResponse extends Student {
  result?: ResultEntry[]
}

export interface StudentResult {
  owner_id: string
  exam_id: string
  student_id: string
  points_per_task: ResultEntry[]
}

export interface ResultEntry extends Task {
  task_id: string
  points: number
}

export interface CreateResultRequest {
  exam_id: string
  student_id: string
  points_per_task: ResultEntry[]
}
