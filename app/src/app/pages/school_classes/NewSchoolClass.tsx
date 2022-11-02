import React, { FunctionComponent, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useSchoolClassContext } from "./SchoolClasses"
import { Button } from "react-bootstrap"
import ModalWrapper from "../../components/modal-wrapper/ModalWrapper"
import Form from "react-bootstrap/Form"

type NewSchoolClassProps = {}

const NewSchoolClass: FunctionComponent<NewSchoolClassProps> = ({}) => {
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
        toast("Klasse erstellt")
        close()
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
    <>
      <Button className="mb-3" onClick={open}>
        Klasse erstellen
      </Button>

      <ModalWrapper size="lg" show={show} close={close} title="Klasse erstellen">
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
      </ModalWrapper>
    </>
  )
}

export default NewSchoolClass
