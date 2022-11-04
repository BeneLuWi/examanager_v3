import React, { FunctionComponent, useState } from "react"
import { SchoolClass, Student } from "../types"
import { Button, Card } from "react-bootstrap"
import { useSchoolClassContext } from "../SchoolClasses"
import { toast } from "react-toastify"
import axios from "axios"
import ModalWrapper from "../../../components/modal-wrapper/ModalWrapper"
import Form from "react-bootstrap/Form"
import ConfirmButton from "../../../components/confirm-button/ConfirmButton"

type SchoolClassDetailsProps = {
  schoolClass: SchoolClass
  students?: Student[]
}

const SchoolClassDetails: FunctionComponent<SchoolClassDetailsProps> = ({ schoolClass, students }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [show, setShow] = useState(false)
  const { updateSchoolClasses } = useSchoolClassContext()

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/
  const open = () => setShow(true)
  const close = () => setShow(false)

  const deleteSchoolClass = () =>
    axios
      .delete(`/api/school_class?school_class_id=${schoolClass._id}`)
      .then(() => updateSchoolClasses())
      .catch(() => toast("Fehler beim bearbeiten", { type: "error" }))

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    let formData = new FormData(event.currentTarget)
    let name = formData.get("name") as string
    let description = formData.get("description") as string

    axios
      .put("api/school_class", {
        ...schoolClass,
        name,
        description,
      })
      .then(() => {
        close()
        updateSchoolClasses()
      })
      .catch(() => toast("Fehler beim bearbeiten", { type: "error" }))
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
          <p>Beschreibung: {schoolClass.description}</p>
          <p>Anzahl der Schüler:innen: {students?.length}</p>
          <hr />
          <Button onClick={open}>Bearbeiten</Button>
        </Card.Body>
      </Card>

      <ModalWrapper size="lg" show={show} close={close} title={`${schoolClass.name} bearbeiten`}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" type="text" placeholder="Name" defaultValue={schoolClass.name} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Beschreibung</Form.Label>
            <Form.Control
              name="description"
              type="text"
              placeholder="Beschreibung (optional)"
              defaultValue={schoolClass.description}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="me-3">
            Speichern
          </Button>
          <ConfirmButton onSuccess={deleteSchoolClass} question={`${schoolClass.name} löschen?`}>
            Klasse Löschen
          </ConfirmButton>
        </Form>
      </ModalWrapper>
    </>
  )
}

export default SchoolClassDetails
