import React, { FunctionComponent, useEffect, useState } from "react"
import { SchoolClass, Student } from "../types"
import Table from "react-bootstrap/Table"
import { Button, Col, Row } from "react-bootstrap"
import StudentListItem from "./StudentListItem"
import NewStudent from "./NewStudent"
import axios from "axios"
import { toast } from "react-toastify"

type StudentListProps = {
  schoolClass: SchoolClass
}

const StudentList: FunctionComponent<StudentListProps> = ({ schoolClass }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [students, setStudents] = useState<Student[]>()

  useEffect(() => {
    updateStudents()
  }, [])

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const updateStudents = () =>
    axios
      .get(`/api/student/${schoolClass._id}`)
      .then((res) => setStudents(res.data))
      .catch(() => toast("Fehler beim Laden Schüler:innen", { type: "error" }))

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <Row>
      <Col xs={8}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Vorname</th>
              <th>Nachname</th>
              <th>Geschlecht</th>
            </tr>
          </thead>
          <tbody>
            {students?.map((student) => (
              <StudentListItem key={student._id} student={student} />
            ))}
          </tbody>
        </Table>
      </Col>
      <Col xs={4}>
        <NewStudent updateStudents={updateStudents} schoolClass={schoolClass} />
      </Col>
    </Row>
  )
}

export default StudentList
