import React, { FunctionComponent, useState } from "react"
import ModalWrapper from "../../components/modal-wrapper/ModalWrapper"
import { Button } from "react-bootstrap"
import Form from "react-bootstrap/Form"
import axios from "axios"
import { useAdminContext } from "./Admin"
import { toast } from "react-toastify"

type NewUserProps = {}

const NewUser: FunctionComponent<NewUserProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [show, setShow] = useState(false)
  const { updateUsers } = useAdminContext()

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
    let username = formData.get("username") as string
    let password = formData.get("password") as string
    let isAdmin = !!(formData.get("isAdmin") as string)

    axios
      .post("api/register", {
        username,
        mail: "",
        password,
        role: isAdmin ? "ADMIN" : "USER",
      })
      .then(() => {
        toast("Nutzer:in erstellt")
        close()
        updateUsers()
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
        Nutzer:in erstellen
      </Button>

      <ModalWrapper size="lg" show={show} close={close} title="Nutzer:in erstellen">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control name="username" type="text" placeholder="Username" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Passwort</Form.Label>
            <Form.Control name="password" type="text" placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check name="isAdmin" type="checkbox" id="admin-check" label="Admin" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Erstellen
          </Button>
        </Form>
      </ModalWrapper>
    </>
  )
}

export default NewUser
