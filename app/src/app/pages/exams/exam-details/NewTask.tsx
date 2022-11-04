import React, { FunctionComponent } from "react"
import { Button, Card } from "react-bootstrap"
import { Exam } from "../types"
import Form from "react-bootstrap/Form"
import { toast } from "react-toastify"
import axios from "axios"
import { useExamContext } from "../Exams"

type NewTaskProps = {
  exam: Exam
}

const NewTask: FunctionComponent<NewTaskProps> = ({ exam }) => {
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
    let name = formData.get("name") as string
    let max_points = formData.get("max_points") as unknown as number

    if (!name.length) {
      toast("Bitte Namen eingeben", { type: "error" })
      return
    }

    axios
      .put("api/exam", {
        ...exam,
        tasks: [
          ...exam.tasks,
          {
            name,
            max_points,
          },
        ],
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
        <Card.Title>Aufgabe hinzufügen</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" type="text" placeholder="Name" defaultValue="Aufgabe" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Beschreibung</Form.Label>
            <Form.Control name="max_points" type="number" defaultValue={10} />
          </Form.Group>
          <Button variant="success" type="submit">
            Erstellen
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default NewTask
