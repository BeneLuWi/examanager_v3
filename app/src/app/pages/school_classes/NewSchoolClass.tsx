import React, { FunctionComponent } from "react"
import { Button, Card } from "react-bootstrap"
import Form from "react-bootstrap/Form"
import { useCreateSchoolClass } from "./api"
import { FieldValues, useForm } from "react-hook-form"
import { SchoolClass } from "./types"

type NewSchoolClassProps = {}

const NewSchoolClass: FunctionComponent<NewSchoolClassProps> = () => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { mutate: createSchoolClass } = useCreateSchoolClass()
  const { register, handleSubmit, reset } = useForm()

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const performCreate = (values: FieldValues) => {
    createSchoolClass(values as SchoolClass, {
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
          <i className="bi bi-plus" /> Klasse erstellen
        </Card.Title>
        <Form onSubmit={handleSubmit((values) => performCreate(values))}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control {...register("name")} type="text" placeholder="Name" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Beschreibung</Form.Label>
            <Form.Control {...register("description")} type="text" placeholder="Beschreibung (optional)" />
          </Form.Group>
          <Button variant="success" type="submit">
            Erstellen
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default NewSchoolClass
