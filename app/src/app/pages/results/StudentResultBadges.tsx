import React, { FunctionComponent, useMemo } from "react"
import { calcGrade } from "../exams/utils"
import { StudentResultsResponse } from "./types"
import { Exam } from "../exams/types"
import { Badge } from "react-bootstrap"

type StudentResultBadgesProps = {
  studentResultsResponse: StudentResultsResponse
  exam: Exam
}

const StudentResultBadges: FunctionComponent<StudentResultBadgesProps> = ({ exam, studentResultsResponse }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [sumOfPoints, rating] = useMemo(() => {
    if (!studentResultsResponse.result) return [0, undefined]

    const sum = studentResultsResponse.result!.reduce((sum, entry) => sum + entry.points, 0)

    return [sum, calcGrade(exam, sum)]
  }, [studentResultsResponse.result])

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  if (!studentResultsResponse.result) {
    return (
      <Badge bg="secondary" pill className="me-1">
        <i className="bi bi-info-circle" /> Kein Ergebnis eingetragen
      </Badge>
    )
  }
  return (
    <div className="d-flex">
      <Badge bg="primary" pill className="me-1">
        <i className="bi bi-patch-check-fill" /> {sumOfPoints.toFixed(1)} Punkte gesamt
      </Badge>
      <Badge bg="primary" pill className="me-1">
        <i className="bi bi-mortarboard-fill" /> Note {rating!.text_rating}
      </Badge>
      {studentResultsResponse.self_assessment && (
        <Badge bg="primary" pill className="me-1">
          <i className="bi bi-mortarboard" /> Selbsteinschätzung {studentResultsResponse.self_assessment} MSS-Punkte
        </Badge>
      )}
    </div>
  )
}

export default StudentResultBadges
