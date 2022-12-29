import React, { FunctionComponent } from "react"
import Form from "react-bootstrap/Form"
import { Button, Card } from "react-bootstrap"
import { SchoolClass, Student } from "../types"
import { FieldValues, useForm } from "react-hook-form"
import { useCreateStudent } from "../api"

type NewStudentProps = {
  schoolClass: SchoolClass
}

const NewStudent: FunctionComponent<NewStudentProps> = ({ schoolClass }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { register, handleSubmit, reset } = useForm()
  const { mutate: createStudent } = useCreateStudent(schoolClass)

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const performCreate = (values: FieldValues) => {
    createStudent(values as Student, {
      onSuccess: () => reset(),
    })
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
          <i className="bi bi-person-plus" /> Schüler:in hinzufügen
        </Card.Title>
        <Form onSubmit={handleSubmit((values) => performCreate(values))}>
          <Form.Group className="mb-3">
            <Form.Label>Vorname</Form.Label>
            <Form.Control {...register("firstname")} required type="text" placeholder="" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nachname</Form.Label>
            <Form.Control {...register("lastname")} type="text" placeholder="(optional)" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Geschlecht</Form.Label>
            <Form.Select {...register("gender")}>
              <option value="w">weiblich</option>
              <option value="m">männlich</option>
              <option value="d">divers</option>
            </Form.Select>
          </Form.Group>
          <Button variant="success" type="submit">
            Erstellen
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default NewStudent
