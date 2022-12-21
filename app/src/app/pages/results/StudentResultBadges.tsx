import React, { FunctionComponent } from "react"
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

  const sumOfPoints = (): number => studentResultsResponse.result!.reduce((sum, entry) => sum + entry.points, 0)

  const rating = calcGrade(exam, sumOfPoints())

  return (
    <div className="d-flex">
      <Badge bg="primary" pill className="me-1">
        <i className="bi bi-patch-check-fill" /> {sumOfPoints()} Punkte gesamt
      </Badge>
      <Badge bg="primary" pill>
        <i className="bi bi-mortarboard-fill" /> Note {rating.text_rating}
      </Badge>
    </div>
  )
}

export default StudentResultBadges
