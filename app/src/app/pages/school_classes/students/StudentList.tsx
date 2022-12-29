import React, { FunctionComponent, useEffect, useState } from "react"
import { SchoolClass } from "../types"
import Table from "react-bootstrap/Table"
import { Card, Col, InputGroup, Row } from "react-bootstrap"
import StudentListItem from "./StudentListItem"
import NewStudent from "./NewStudent"
import SchoolClassDetails from "./SchoolClassDetails"
import { useFetchStudents } from "../api"
import Form from "react-bootstrap/Form"

type StudentListProps = {
  schoolClass: SchoolClass
}

const StudentList: FunctionComponent<StudentListProps> = ({ schoolClass }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { data: students } = useFetchStudents(schoolClass)
  const [name, setName] = useState("")
  const [foundStudents, setFoundStudents] = useState(students)

  useEffect(() => {
    if (!name.length) {
      setFoundStudents(students)
    }
    setFoundStudents(
      students?.filter(
        (student) => student.firstname.toLowerCase().includes(name) || student.lastname.toLowerCase().includes(name)
      )
    )
  }, [name, students])

  // Reset on Unmount
  useEffect(() => () => setName(""), [])

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <Row className="h-100 pt-3 pb-3" style={{ overflowY: "scroll" }}>
      <Col xs={8}>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="bi bi-people" /> Liste der Schüler:innen
            </Card.Title>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <i className="bi bi-search" />
              </InputGroup.Text>
              <Form.Control
                onChange={(event) => setName(event.target.value)}
                value={name}
                placeholder="Suche"
                aria-label="Name"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
            <Table striped hover>
              <thead>
                <tr>
                  <th>Vorname</th>
                  <th>Nachname</th>
                  <th>Geschlecht</th>
                </tr>
              </thead>
              <tbody>
                {foundStudents?.map((student) => (
                  <StudentListItem key={student._id} student={student} />
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={4}>
        <NewStudent schoolClass={schoolClass} />
        <div className="mb-4" />
        <SchoolClassDetails students={students} schoolClass={schoolClass} />
      </Col>
    </Row>
  )
}

export default StudentList
