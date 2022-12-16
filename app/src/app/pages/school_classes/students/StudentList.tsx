import React, { FunctionComponent } from "react"
import { SchoolClass } from "../types"
import Table from "react-bootstrap/Table"
import { Card, Col, Row } from "react-bootstrap"
import StudentListItem from "./StudentListItem"
import NewStudent from "./NewStudent"
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

  const { data: students } = useFetchStudents(schoolClass)

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
