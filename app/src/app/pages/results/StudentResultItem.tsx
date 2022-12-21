import React, { FunctionComponent, useReducer } from "react"
import { ListGroup } from "react-bootstrap"
import { Exam } from "../exams/types"
import { StudentResultsResponse } from "./types"
import StudentResultForm from "./StudentResultForm"
import StudentResultBadges from "./StudentResultBadges"

type StudentResultItemProps = {
  studentResultsResponse: StudentResultsResponse
  exam: Exam
}

const StudentResultItem: FunctionComponent<StudentResultItemProps> = ({ studentResultsResponse, exam }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [edit, toggleEdit] = useReducer((state) => !state, false)

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
    <>
      <ListGroup.Item action onClick={toggleEdit}>
        <div className="fw-bold">
          {studentResultsResponse.firstname} {studentResultsResponse.lastname}
        </div>
        <StudentResultBadges {...{ studentResultsResponse, exam }} />
      </ListGroup.Item>

      <StudentResultForm {...{ studentResultsResponse, exam, toggleEdit, edit }} />
    </>
  )
}

export default StudentResultItem
