import React, { FunctionComponent, useState } from "react"
import { Student } from "../types"
import { Button } from "react-bootstrap"
import Form from "react-bootstrap/Form"
import ModalWrapper from "../../../components/modal-wrapper/ModalWrapper"
import ConfirmButton from "../../../components/confirm-button/ConfirmButton"
import { useDeleteStudent, useUpdateStudent } from "../api"
import { FieldValues, useForm } from "react-hook-form"

type StudentListItemProps = {
  student: Student
}

const StudentListItem: FunctionComponent<StudentListItemProps> = ({ student }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [edit, setEdit] = useState(false)

  const { register, handleSubmit, reset } = useForm()
  const { mutate: updateStudent } = useUpdateStudent()
  const { mutate: deleteStudent } = useDeleteStudent(student)

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const close = () => setEdit(false)
  const open = () => setEdit(true)

  const performUpdate = (values: FieldValues) => {
    updateStudent(
      {
        ...student,
        ...values,
      },
      {
        onSuccess: () => {
          reset()
          close()
        },
      }
    )
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
      <ModalWrapper
        options={{ size: "sm" }}
        title={`${student.firstname} ${student.lastname} bearbeiten`}
        show={edit}
        close={close}
      >
        <Form onSubmit={handleSubmit((values) => performUpdate(values))}>
          <Form.Group className="mb-3">
            <Form.Label>Vorname</Form.Label>
            <Form.Control {...register("firstname")} type="text" placeholder="" defaultValue={student.firstname} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nachname</Form.Label>
            <Form.Control
              {...register("lastname")}
              type="text"
              placeholder="(optional)"
              defaultValue={student.lastname}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Geschlecht</Form.Label>
            <Form.Select {...register("gender")} defaultValue={student.gender}>
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
