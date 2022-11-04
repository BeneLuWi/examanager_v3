export interface Exam {
  _id: string
  name: string
  description: string
  tasks: Task[]
  owner_id: string
}

export interface Task {
  _id: string
  name: string
  max_points: number
}

export interface ExamContextType {
  exams?: Exam[]
  updateExams: VoidFunction
}
