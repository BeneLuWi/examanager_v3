import React, { FunctionComponent } from "react"
import { Button, Card } from "react-bootstrap"
import Form from "react-bootstrap/Form"
import axios from "axios"
import { toast } from "react-toastify"
import { Exam } from "./types"
import { useExamContext } from "./Exams"

type NewExamProps = {}

const NewExam: FunctionComponent<NewExamProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { updateExams } = useExamContext()

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    let formData = new FormData(event.currentTarget)
    const [name, description] = [formData.get("name"), formData.get("description")]

    axios
      .post("api/exam", {
        name,
        description,
        tasks: [],
      })
      .then(() => {
        updateExams()

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
    <Card>
      <Card.Body>
        <Card.Title>
          <i className="bi bi-file-earmark-plus" /> Klausur hinzufügen
        </Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" type="text" placeholder="" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control name="description" type="text" placeholder="(optional)" />
          </Form.Group>
          <Button variant="success" type="submit">
            Erstellen
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default NewExam
