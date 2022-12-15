import React, { FunctionComponent, useEffect, useState } from "react"
import { SchoolClass, Student } from "../types"
import Table from "react-bootstrap/Table"
import { Button, Card, Col, Row } from "react-bootstrap"
import StudentListItem from "./StudentListItem"
import NewStudent from "./NewStudent"
import axios from "axios"
import { toast } from "react-toastify"
import SchoolClassDetails from "./SchoolClassDetails"
import { useFetchStudents } from "../api"

type StudentListProps = {
  schoolClass: SchoolClass
}

const StudentList: FunctionComponent<StudentListProps> = ({ schoolClass }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [students1, setStudents] = useState<Student[]>()

  useEffect(() => {
    updateStudents()
  }, [])

  const { data: students } = useFetchStudents(schoolClass)

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
    <Row className="h-100 " style={{ overflowY: "scroll" }}>
      <Col xs={8}>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="bi bi-people" /> Liste der Schüler:innen
            </Card.Title>
            <Table striped hover>
              <thead>
                <tr>
                  <th>Vorname</th>
                  <th>Nachname</th>
                  <th>Geschlecht</th>
                </tr>
              </thead>
              <tbody>
                {students?.map((student) => (
                  <StudentListItem key={student._id} student={student} updateStudents={updateStudents} />
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={4}>
        <NewStudent updateStudents={updateStudents} schoolClass={schoolClass} />
        <div className="mb-4" />
        <SchoolClassDetails students={students} schoolClass={schoolClass} />
      </Col>
    </Row>
  )
}

export default StudentList
