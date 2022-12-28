import React, { FunctionComponent, useState } from "react"
import { useStatisticsContext } from "../Statistics"
import { useFetchResults } from "../../results/api"
import { Card } from "react-bootstrap"
import ListGroupCard from "../../../components/list-group-card/ListGroupCard"
import { GradeMode } from "../types"
import StudentResultItem from "./StudentResultItem"
import Table from "react-bootstrap/Table"

type StudentResultListProps = {}

const StudentResultList: FunctionComponent<StudentResultListProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { exam, schoolClass } = useStatisticsContext()
  const { data: examResults } = useFetchResults(schoolClass?._id, exam?._id)
  const [mode, setMode] = useState<GradeMode>("text_rating")
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
    <Card>
      <Card.Body>
        <Card.Title>Ergebnisse</Card.Title>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nachname</th>
              <th>Vorname</th>
              <th>Geschlecht</th>
              <th>Note</th>
              <th>Erreichte Punkte</th>
            </tr>
          </thead>
          <tbody>
            {examResults &&
              examResults.studentResults.map((studentResult) => (
                <StudentResultItem key={studentResult._id} studentResultsResponse={studentResult} mode={mode} />
              ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

export default StudentResultList
