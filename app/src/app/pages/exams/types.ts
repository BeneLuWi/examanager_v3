export interface Exam {
  _id: string
  name: string
  description: string
  tasks: Task[]
  ratings: Rating[]
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

export interface Rating {
  percentage: number
  mss_points: number
  decimal_rating: number
  school_rating: string
  text_rating: string
}
