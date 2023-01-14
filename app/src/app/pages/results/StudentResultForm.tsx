import React, { FunctionComponent, useState } from "react"
import Form from "react-bootstrap/Form"
import { Button, InputGroup } from "react-bootstrap"
import { Exam } from "../exams/types"
import { ResultEntry, StudentResultsResponse } from "./types"
import { useCreateResult, useDeleteResult } from "./api"
import ModalWrapper from "../../components/modal-wrapper/ModalWrapper"
import ConfirmButton from "../../components/confirm-button/ConfirmButton"
import { SubmitHandler, useForm } from "react-hook-form"

type StudentResultFormProps = {
  studentResultsResponse: StudentResultsResponse
  exam: Exam
  toggleEdit: VoidFunction
  edit: boolean
}

const defaultResultEntries = (exam: Exam): ResultEntry[] => {
  return exam.tasks.map((task) => ({ ...task, task_id: task._id, points: 0, deactivated: false }))
}

type FormType = {
  [x: string]: number
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
  const [pointsPerTask] = useState<ResultEntry[]>(studentResultsResponse.result ?? defaultResultEntries(exam))
  const { mutate: createResult } = useCreateResult()
  const { mutate: deleteResult } = useDeleteResult(exam, studentResultsResponse)
  const { register, handleSubmit } = useForm()

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const onSubmit: SubmitHandler<FormType> = (data) => {
    const points_per_task = pointsPerTask.map((entry) => ({
      ...entry,
      points: data[entry.task_id],
    }))

    createResult({
      exam_id: exam._id,
      student_id: studentResultsResponse._id,
      points_per_task: points_per_task,
      self_assessment: data.selfAssessment,
    })
    toggleEdit()
  }

  const handleDelete = () => {
    deleteResult()
    toggleEdit()
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
        <Form onSubmit={handleSubmit(onSubmit)}>
          {pointsPerTask.map((resultEntry) => (
            <div key={resultEntry.task_id} className="mb-1">
              <Form.Label htmlFor={resultEntry.task_id}>
                {resultEntry.name}
                {resultEntry.deactivated && " (bei der Bewertung ignoriert)"}
              </Form.Label>
              <InputGroup>
                {resultEntry.deactivated && (
                  <InputGroup.Text>
                    <i className="bi bi-slash-circle" />
                  </InputGroup.Text>
                )}
                <Form.Control
                  defaultValue={resultEntry.points}
                  {...register(resultEntry.task_id, {
                    valueAsNumber: true,
                    min: 0,
                    max: resultEntry.max_points,
                  })}
                  type="number"
                  step="0.1"
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
                defaultValue={studentResultsResponse.self_assessment}
                type="number"
                {...register("selfAssessment", {
                  valueAsNumber: true,
                  min: 0,
                  max: 15,
                })}
                placeholder="(optional)"
                id={"selfAssessment"}
              />
              <InputGroup.Text>MSS-Punkte</InputGroup.Text>
            </InputGroup>
          </div>
          <hr />
          <div>
            <Button variant="primary" className="me-2" type="submit">
              Speichern
            </Button>
            <ConfirmButton onSuccess={handleDelete} question="Klausurergebnis Löschen?">
              Ergebnis löschen
            </ConfirmButton>
          </div>
        </Form>
      </div>
    </ModalWrapper>
  )
}

export default StudentResultForm
