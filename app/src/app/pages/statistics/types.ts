import { Exam, Rating } from "../exams/types"
import React, { SetStateAction } from "react"
import { SchoolClass } from "../school_classes/types"

export interface AverageGrade {
  total: Rating
  m: Rating
  w: Rating
  d: Rating
}

const exampleAverage: AverageGrade = {
  total: {
    percentage: 0.455,
    mss_points: 5,
    decimal_rating: 4.3,
    school_rating: "4",
    text_rating: "Ausreichend",
  },
  m: {
    percentage: 0.75,
    mss_points: 11,
    decimal_rating: 2.3,
    school_rating: "2",
    text_rating: "Gut",
  },
  w: {
    percentage: 0.8,
    mss_points: 12,
    decimal_rating: 2,
    school_rating: "2+",
    text_rating: "Gut",
  },
  d: {
    percentage: 0.9,
    mss_points: 14,
    decimal_rating: 1.3,
    school_rating: "1",
    text_rating: "Sehr Gut",
  },
}

export interface StatisticsContextType {
  exam?: Exam
  setExam: React.Dispatch<SetStateAction<Exam | undefined>>

  schoolClass?: SchoolClass
  setSchoolClass: React.Dispatch<SetStateAction<SchoolClass | undefined>>
}
