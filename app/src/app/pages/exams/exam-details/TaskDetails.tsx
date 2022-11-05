import React, { FunctionComponent, useState } from "react"
import { Exam } from "../types"
import { Button, Card } from "react-bootstrap"
import ConfirmButton from "../../../components/confirm-button/ConfirmButton"
import axios from "axios"
import { useExamContext } from "../Exams"
import { toast } from "react-toastify"
import ModalWrapper from "../../../components/modal-wrapper/ModalWrapper"
import Form from "react-bootstrap/Form"

type TaskDetailsProps = {
  exam: Exam
}

const TaskDetails: FunctionComponent<TaskDetailsProps> = ({ exam }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/
  const [show, setShow] = useState(false)
  const { updateExams } = useExamContext()
  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const open = () => setShow(true)
  const close = () => setShow(false)

  const deleteExam = () =>
    axios
      .delete(`/api/exam?exam_id=${exam._id}`)
      .then(() => updateExams())
      .catch(() => toast("Fehler beim Löschen", { type: "error" }))

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    let formData = new FormData(event.currentTarget)
    const [name, description] = [formData.get("name"), formData.get("description")]

    axios
      .put("api/exam", {
        ...exam,
        name,
        description,
      })
      .then(() => {
        updateExams()
        close()
        // @ts-ignore
        event.target.reset()
      })
      .catch(() => toast("Fehler beim erstellen", { type: "error" }))
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
          <p>Insgesamt {exam.tasks.reduce((a, b) => a + b.max_points, 0)} Punkte</p>
          <Button onClick={open}>Bearbeiten</Button>
        </Card.Body>
      </Card>

      <ModalWrapper size="lg" show={show} close={close} title={`${exam.name} bearbeiten`}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" type="text" placeholder="" defaultValue={exam.name} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control name="description" type="text" placeholder="(optional)" defaultValue={exam.description} />
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

export default TaskDetails
