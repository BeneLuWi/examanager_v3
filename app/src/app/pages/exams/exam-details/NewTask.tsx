import React, { FunctionComponent } from "react"
import { Button, Card } from "react-bootstrap"
import { Exam, Task } from "../types"
import Form from "react-bootstrap/Form"
import { FieldValues, useForm } from "react-hook-form"
import { useUpdateExam } from "../api"

type NewTaskProps = {
  exam: Exam
}

const NewTask: FunctionComponent<NewTaskProps> = ({ exam }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { register, handleSubmit, reset } = useForm()

  const { mutate: updateExam } = useUpdateExam()

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const performUpdate = (values: FieldValues) => {
    updateExam(
      {
        ...exam,
        tasks: [...exam.tasks, values as Task],
      },
      {
        onSuccess: () => reset(),
      }
    )
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
        <Form onSubmit={handleSubmit((values) => performUpdate(values))}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control {...register("name")} type="text" placeholder="Name" defaultValue="Aufgabe" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Beschreibung</Form.Label>
            <Form.Control {...register("max_points")} type="number" defaultValue={10} />
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
