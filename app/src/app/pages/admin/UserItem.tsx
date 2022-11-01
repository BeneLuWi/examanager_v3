import React, { FunctionComponent, useState } from "react"
import { User } from "./types"
import { Button, InputGroup, ListGroup } from "react-bootstrap"
import Form from "react-bootstrap/Form"
import ModalWrapper from "../../components/modal-wrapper/ModalWrapper"
import axios from "axios"
import { useAdminContext } from "./Admin"
import { toast } from "react-toastify"
import { Roles } from "../../auth/types"

type UserItemProps = {
  user: User
}

const UserItem: FunctionComponent<UserItemProps> = ({ user }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { updateUsers } = useAdminContext()

  const [edit, setEdit] = useState(false)
  const [password, setPassword] = useState("")

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const close = () => setEdit(false)
  const open = () => setEdit(true)

  const deleteUser = () =>
    window.confirm(`${user.username} löschen?`) &&
    axios
      .delete(`/api/deleteUser?=${user.username}`)
      .then(() => updateUsers())
      .catch(() => toast("Nutzer:in konnte nicht gelöscht werden", { type: "error" }))

  const updatePassword = () => {
    if (!password.length || password.length < 5) {
      toast("Passwort muss mindestens 5 Zeichen lang sein", { type: "error" })
    } else {
      axios
        .put("api/update_password", {
          username: user.username,
          password: password,
        })
        .then(() => {
          toast("Passwort aktualisiert")
          close()
          updateUsers()
          setPassword("")
        })
        .catch(() => toast("Fehler beim aktualisieren", { type: "error" }))
    }
  }

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <>
      <ListGroup.Item action onClick={open}>
        {user.username} - Role: {user.role === 0 ? "User" : "Admin"}
      </ListGroup.Item>
      <ModalWrapper size="lg" title={`${user.username} bearbeiten`} show={edit} close={close}>
        <InputGroup className="mb-3">
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Neues Passwort"
            aria-label="Neues Passwort"
            aria-describedby="basic-addon2"
          />
          <Button onClick={updatePassword} variant="primary">
            Speichern
          </Button>
        </InputGroup>
        <hr />
        <Button variant="danger" disabled={user.role === Roles.ADMIN} onClick={deleteUser}>
          Nutzer:in löschen
        </Button>
      </ModalWrapper>
    </>
  )
}

export default UserItem
