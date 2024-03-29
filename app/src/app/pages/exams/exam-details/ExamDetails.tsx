import React, { FunctionComponent, useState } from "react"
import { Exam } from "../types"
import { Button, Card } from "react-bootstrap"
import ConfirmButton from "../../../components/confirm-button/ConfirmButton"
import axios from "axios"
import ModalWrapper from "../../../components/modal-wrapper/ModalWrapper"
import Form from "react-bootstrap/Form"
import { useMutation, useQueryClient } from "react-query"
import { FieldValues, useForm } from "react-hook-form"
import { useUpdateExam } from "../api"

type ExamDetailsProps = {
  exam: Exam
}

const ExamDetails: FunctionComponent<ExamDetailsProps> = ({ exam }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/
  const [show, setShow] = useState(false)

  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm()

  const { mutate: updateExam } = useUpdateExam()

  const { mutate: deleteExam } = useMutation(() => axios.delete(`/api/exam?exam_id=${exam._id}`), {
    onSuccess: () => {
      close()
      queryClient.invalidateQueries("exams")
      queryClient.invalidateQueries("results")
    },
  })

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const open = () => setShow(true)
  const close = () => setShow(false)

  const performUpdate = (values: FieldValues) => {
    updateExam(
      { ...exam, ...values },
      {
        onSuccess: () => {
          close()
          reset()
        },
      }
    )
  }

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>
            <i className="bi bi-info-circle" /> Infos
          </Card.Title>
          <p>Name: {exam.name}</p>
          <p>Beschreibung: {exam.description}</p>
          <p>Insgesamt {exam.tasks.reduce((a, b) => a + b.max_points, 0)} Punkte</p>
          <Button onClick={open}>Bearbeiten</Button>
        </Card.Body>
      </Card>

      <ModalWrapper options={{ size: "lg" }} show={show} close={close} title={`${exam.name} bearbeiten`}>
        <Form onSubmit={handleSubmit((values) => performUpdate(values))}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control {...register("name")} type="text" placeholder="" required defaultValue={exam.name} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Beschreibung</Form.Label>
            <Form.Control
              {...register("description")}
              type="text"
              placeholder="(optional)"
              defaultValue={exam.description}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="me-2">
            Speichern
          </Button>
          <ConfirmButton onSuccess={deleteExam} question={`${exam.name} löschen?`}>
            Klausur Löschen
          </ConfirmButton>
        </Form>
      </ModalWrapper>
    </>
  )
}

export default ExamDetails
