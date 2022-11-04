import React, { FunctionComponent, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useSchoolClassContext } from "./SchoolClasses"
import { Button, Card } from "react-bootstrap"
import ModalWrapper from "../../components/modal-wrapper/ModalWrapper"
import Form from "react-bootstrap/Form"

type NewSchoolClassProps = {}

const NewSchoolClass: FunctionComponent<NewSchoolClassProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { updateSchoolClasses } = useSchoolClassContext()

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    let formData = new FormData(event.currentTarget)
    let name = formData.get("name") as string
    let description = formData.get("description") as string

    if (!name.length) {
      toast("Bitte Namen eingeben", { type: "error" })
      return
    }

    axios
      .post("api/school_class", {
        name,
        description,
      })
      .then(() => {
        updateSchoolClasses()
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
        <Card.Title>Klasse erstellen</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" type="text" placeholder="Name" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Beschreibung</Form.Label>
            <Form.Control name="description" type="text" placeholder="Beschreibung (optional)" />
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
