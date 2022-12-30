import { Exam, Rating } from "../exams/types"
import React, { SetStateAction } from "react"
import { SchoolClass } from "../school_classes/types"

export interface ExamStatistics {
  mean: Statistic
  median: Statistic
  standard_deviation: Statistic
  difficulty: Statistic
  correlation: Statistic
  self_assessment: Statistic
  mean_mss: Statistic
  median_mss: Statistic
}

export interface Statistic {
  name: string
  statistics: StatisticsData[]
}

export interface StatisticsData {
  name: string
  value_total: number
  value_w: number
  value_m: number
  value_d: number
}

export interface StatisticsContextType {
  exam?: Exam
  setExam: React.Dispatch<SetStateAction<Exam | undefined>>

  schoolClass?: SchoolClass
  setSchoolClass: React.Dispatch<SetStateAction<SchoolClass | undefined>>
}

export type GradeMode = "mss_points" | "decimal_rating" | "school_rating" | "text_rating"

export const gradesModeList: GradeMode[] = ["mss_points", "decimal_rating", "school_rating", "text_rating"]
