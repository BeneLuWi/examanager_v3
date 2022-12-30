import React, { FunctionComponent, useState } from "react"
import Form from "react-bootstrap/Form"
import { Button, InputGroup } from "react-bootstrap"
import { Exam } from "../exams/types"
import { ResultEntry, StudentResultsResponse } from "./types"
import { useCreateResult, useDeleteResult } from "./api"
import ModalWrapper from "../../components/modal-wrapper/ModalWrapper"
import ConfirmButton from "../../components/confirm-button/ConfirmButton"

type StudentResultFormProps = {
  studentResultsResponse: StudentResultsResponse
  exam: Exam
  toggleEdit: VoidFunction
  edit: boolean
}

const defaultResultEntries = (exam: Exam): ResultEntry[] => {
  return exam.tasks.map((task) => ({ ...task, task_id: task._id, points: 0 }))
}

const StudentResultForm: FunctionComponent<StudentResultFormProps> = ({
  studentResultsResponse,
  exam,
  toggleEdit,
  edit,
}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/
  const [pointsPerTask, setPointsPerTask] = useState<ResultEntry[]>(
    studentResultsResponse.result ?? defaultResultEntries(exam)
  )
  const [selfAssessment, setSelfAssessment] = useState(studentResultsResponse.self_assessment)
  const { mutate: createResult } = useCreateResult()
  const { mutate: deleteResult } = useDeleteResult(exam, studentResultsResponse)
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
      self_assessment: selfAssessment,
    })
    toggleEdit()
  }

  const handleDelete = () => {
    deleteResult()
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
    <ModalWrapper show={edit} options={{ backdrop: "static" }} close={toggleEdit} title="Klausurergebnis">
      <div>
        <h4>
          {studentResultsResponse.firstname} {studentResultsResponse.lastname}
        </h4>
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
        <hr />
        <div className="mb-1">
          <Form.Label htmlFor="selfAssessment">Selbsteinschätzung</Form.Label>
          <InputGroup>
            <Form.Control
              value={selfAssessment}
              onChange={(event) => setSelfAssessment(parseInt(event.target.value))}
              type="number"
              placeholder="(optional)"
              max={15}
              min={0}
              id={"selfAssessment"}
            />
            <InputGroup.Text>MSS-Punkte</InputGroup.Text>
          </InputGroup>
        </div>
        <hr />
        <div>
          <Button variant="primary" className="me-2" onClick={submit}>
            Speichern
          </Button>
          <ConfirmButton onSuccess={handleDelete} question="Klausurergebnis Löschen?">
            Ergebnis löschen
          </ConfirmButton>
        </div>
      </div>
    </ModalWrapper>
  )
}

export default StudentResultForm
