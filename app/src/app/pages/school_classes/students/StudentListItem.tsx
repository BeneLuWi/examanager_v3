import React, { FunctionComponent, useState } from "react"
import { Student } from "../types"
import { Button, InputGroup } from "react-bootstrap"
import Form from "react-bootstrap/Form"
import ModalWrapper from "../../../components/modal-wrapper/ModalWrapper"
import axios from "axios"
import { toast } from "react-toastify"
import ConfirmButton from "../../../components/confirm-button/ConfirmButton"

type StudentListItemProps = {
  student: Student
  updateStudents: VoidFunction
}

const StudentListItem: FunctionComponent<StudentListItemProps> = ({ student, updateStudents }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [edit, setEdit] = useState(false)

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const close = () => setEdit(false)
  const open = () => setEdit(true)

  const deleteStudent = () =>
    axios
      .delete(`/api/student?student_id=${student._id}`)
      .then(() => {
        close()
        updateStudents()
      })
      .catch(() => toast("Schüler:in konnte nicht gelöscht werden", { type: "error" }))

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    let formData = new FormData(event.currentTarget)
    const studentData: Student = Object.fromEntries(formData) as Student

    axios
      .put("api/student", {
        ...student,
        firstname: studentData.firstname,
        lastname: studentData.lastname,
        gender: studentData.gender,
      })
      .then(() => {
        updateStudents()
        close()
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
    <>
      <tr className="cursor-pointer" onClick={open}>
        <td>{student.firstname}</td>
        <td>{student.lastname}</td>
        <td>{student.gender}</td>
      </tr>
      <ModalWrapper size="lg" title={`${student.firstname} ${student.lastname} bearbeiten`} show={edit} close={close}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Vorname</Form.Label>
            <Form.Control name="firstname" type="text" placeholder="" defaultValue={student.firstname} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nachname</Form.Label>
            <Form.Control name="lastname" type="text" placeholder="(optional)" defaultValue={student.lastname} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Geschlecht</Form.Label>
            <Form.Select name="gender" defaultValue={student.gender}>
              <option value="w">weiblich</option>
              <option value="m">männlich</option>
              <option value="d">divers</option>
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit" className="me-2">
            Speichern
          </Button>
          <ConfirmButton
            onSuccess={deleteStudent}
            question={`${student.firstname} ${student.lastname} löschen?`}
            variant="danger"
          >
            Schüler:in löschen
          </ConfirmButton>
        </Form>
      </ModalWrapper>
    </>
  )
}

export default StudentListItem
