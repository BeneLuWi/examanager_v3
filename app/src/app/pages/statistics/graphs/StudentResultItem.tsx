import React, { FunctionComponent, useMemo } from "react"
import { ListGroup } from "react-bootstrap"
import { StudentResultsResponse } from "../../results/types"
import { GradeMode } from "../types"
import { calcGrade } from "../../exams/utils"
import { useStatisticsContext } from "../Statistics"

type StudentResultItemProps = {
  studentResultsResponse: StudentResultsResponse
  mode: GradeMode
}

const StudentResultItem: FunctionComponent<StudentResultItemProps> = ({ studentResultsResponse, mode }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { exam, schoolClass } = useStatisticsContext()

  const [sumOfPoints, rating] = useMemo(() => {
    if (!studentResultsResponse.result || !exam) return [0, undefined]

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

  return (
    <tr>
      <td>{studentResultsResponse.lastname}</td>
      <td>{studentResultsResponse.firstname}</td>
      <td>{studentResultsResponse.gender}</td>
      <td>{rating?.text_rating}</td>
      <td>{sumOfPoints}</td>
    </tr>
  )
}

export default StudentResultItem
