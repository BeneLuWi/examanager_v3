import React, { FunctionComponent, useState } from "react"
import { User } from "./types"
import { Button, InputGroup, ListGroup } from "react-bootstrap"
import Form from "react-bootstrap/Form"
import ModalWrapper from "../../components/modal-wrapper/ModalWrapper"

type UserItemProps = {
  user: User
}

const UserItem: FunctionComponent<UserItemProps> = ({ user }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [edit, setEdit] = useState(false)
  const [password, setPassword] = useState("")

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const close = () => setEdit(false)
  const open = () => setEdit(true)

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <>
      <ListGroup.Item action onClick={open}>
        {user.username} - Role: {user.role === 0 ? "Admin" : "User"}
      </ListGroup.Item>
      <ModalWrapper title={`${user.username} bearbeiten`} show={edit} close={close}>
        <InputGroup className="mb-3">
          <Form.Control
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Neues Passwort"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
          />
          <Button variant="outline-secondary" id="button-addon2">
            Speichern
          </Button>
        </InputGroup>
      </ModalWrapper>
    </>
  )
}

export default UserItem
