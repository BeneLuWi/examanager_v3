import React, { FunctionComponent, useRef } from "react"
import Form from "react-bootstrap/Form"
import { Button } from "react-bootstrap"
import { toast } from "react-toastify"
import axios from "axios"
import { SchoolClass, Student } from "../types"

type NewStudentProps = {
  updateStudents: VoidFunction
  schoolClass: SchoolClass
}

const NewStudent: FunctionComponent<NewStudentProps> = ({ updateStudents, schoolClass }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    let formData = new FormData(event.currentTarget)
    const studentData: Student = Object.fromEntries(formData) as Student

    axios
      .post("api/student", {
        ...studentData,
        school_class_id: schoolClass._id,
      })
      .then(() => {
        updateStudents()

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
    <div className="card">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Vorname</Form.Label>
          <Form.Control name="firstname" type="text" placeholder="" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Nachname</Form.Label>
          <Form.Control name="lastname" type="text" placeholder="(optional)" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Geschlecht</Form.Label>
          <Form.Select name="gender">
            <option value="w">weiblich</option>
            <option value="m">männlich</option>
            <option value="d">divers</option>
          </Form.Select>
        </Form.Group>
        <Button variant="success" type="submit">
          Erstellen
        </Button>
      </Form>
    </div>
  )
}

export default NewStudent
