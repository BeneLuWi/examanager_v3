import { Exam, Task } from "../exams/types"
import { SchoolClass, Student } from "../school_classes/types"
import React, { SetStateAction } from "react"

export interface Result {
  owner_id: string
  student_id: string
  exam_id: string
  points_per_task: []
  self_assessment?: number
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
  self_assessment?: number
}

export interface StudentResult {
  owner_id: string
  exam_id: string
  student_id: string
  points_per_task: ResultEntry[]
  self_assessment?: number
}

export interface ResultEntry extends Task {
  task_id: string
  points: number
  deactivated: boolean
}

export interface CreateResultRequest {
  exam_id: string
  student_id: string
  points_per_task: ResultEntry[]
  self_assessment?: number
}
