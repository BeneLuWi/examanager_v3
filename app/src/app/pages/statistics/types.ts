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

export interface AverageGrade extends Rating {
  type: string
}

export const exampleAverage: AverageGrade[] = [
  {
    type: "Insgesamt",
    percentage: 0.455,
    mss_points: 5,
    decimal_rating: 4.3,
    school_rating: "4",
    text_rating: "Ausreichend",
  },
  {
    type: "M",
    percentage: 0.75,
    mss_points: 11,
    decimal_rating: 2.3,
    school_rating: "2",
    text_rating: "Gut",
  },
  {
    type: "W",
    percentage: 0.8,
    mss_points: 12,
    decimal_rating: 2,
    school_rating: "2+",
    text_rating: "Gut",
  },
  {
    type: "D",
    percentage: 0.9,
    mss_points: 14,
    decimal_rating: 1.3,
    school_rating: "1",
    text_rating: "Sehr Gut",
  },
]

export interface StatisticsContextType {
  exam?: Exam
  setExam: React.Dispatch<SetStateAction<Exam | undefined>>

  schoolClass?: SchoolClass
  setSchoolClass: React.Dispatch<SetStateAction<SchoolClass | undefined>>
}

export type GradeMode = "mss_points" | "decimal_rating" | "school_rating" | "text_rating"

export const gradesModeList: GradeMode[] = ["mss_points", "decimal_rating", "school_rating", "text_rating"]
