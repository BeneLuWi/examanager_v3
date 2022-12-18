import React, { FunctionComponent, useReducer, useState } from "react"
import { Button, InputGroup, ListGroup } from "react-bootstrap"
import { Exam } from "../exams/types"
import { ResultEntry, StudentResultsResponse } from "./types"
import ModalWrapper from "../../components/modal-wrapper/ModalWrapper"
import Form from "react-bootstrap/Form"
import { useCreateResult } from "./api"

type StudentResultItemProps = {
  studentResultsResponse: StudentResultsResponse
  exam: Exam
}

const defaultResultEntries = (exam: Exam): ResultEntry[] => {
  return exam.tasks.map((task) => ({ ...task, task_id: task._id, points: 0 }))
}

const StudentResultItem: FunctionComponent<StudentResultItemProps> = ({ studentResultsResponse, exam }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [edit, toggleEdit] = useReducer((state) => !state, false)

  const [pointsPerTask, setPointsPerTask] = useState<ResultEntry[]>(
    studentResultsResponse.result.length ? studentResultsResponse.result : defaultResultEntries(exam)
  )
  const { mutate: createResult } = useCreateResult()

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const submit = () => {
    createResult({
      exam_id: exam._id,
      student_id: studentResultsResponse._id,
      points_per_task: pointsPerTask,
    })
    toggleEdit()
  }

  const onChangePointsReached = (value: string, task: ResultEntry) => {
    // Parse to a Float with 2 Digits
    let numValue = parseFloat(parseFloat(value).toFixed(2))

    // Validate
    if (numValue > task.max_points) {
      numValue = task.max_points
    }

    setPointsPerTask(
      pointsPerTask.map((entry) => {
        if (entry.task_id !== task.task_id) {
          return entry
        }

        return {
          ...entry,
          points: numValue,
        }
      })
    )
  }
  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <>
      <ListGroup.Item action onClick={toggleEdit}>
        <div>
          <div>
            {studentResultsResponse.firstname} {studentResultsResponse.lastname}
          </div>
        </div>
      </ListGroup.Item>

      <ModalWrapper show={edit} size={"sm"} close={toggleEdit} title="Klausurergebnis">
        <div>
          <h4>
            {studentResultsResponse.firstname} {studentResultsResponse.lastname}
          </h4>
        </div>
        {pointsPerTask.map((resultEntry) => (
          <div key={resultEntry.task_id} className="mb-1">
            <Form.Label htmlFor={resultEntry.task_id}>{resultEntry.name}</Form.Label>
            <InputGroup>
              <Form.Control
                value={resultEntry.points}
                onChange={(event) => onChangePointsReached(event.target.value, resultEntry)}
                type="number"
                max={resultEntry.max_points}
                min={0}
                id={resultEntry.task_id}
              />
              <InputGroup.Text>von {resultEntry.max_points} Punkten</InputGroup.Text>
            </InputGroup>
          </div>
        ))}
        <Button onClick={submit}>Speichern</Button>
      </ModalWrapper>
    </>
  )
}

export default StudentResultItem
