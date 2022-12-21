import React, { FunctionComponent, useReducer, useState } from "react"
import { Badge, Button, InputGroup, ListGroup } from "react-bootstrap"
import { Exam } from "../exams/types"
import { ResultEntry, StudentResultsResponse } from "./types"
import ModalWrapper from "../../components/modal-wrapper/ModalWrapper"
import Form from "react-bootstrap/Form"
import { useCreateResult } from "./api"
import { calcGrade } from "../exams/utils"
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
