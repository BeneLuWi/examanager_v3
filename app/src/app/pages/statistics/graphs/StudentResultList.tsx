import React, { FunctionComponent, useState } from "react"
import { useStatisticsContext } from "../Statistics"
import { useFetchResults } from "../../results/api"
import { GradeMode } from "../types"
import StudentResultItem from "./StudentResultItem"
import Table from "react-bootstrap/Table"
import ExpandableCard from "../../../components/expandable-card/ExpandableCard"

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
    <ExpandableCard title="Ergebnisse">
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
    </ExpandableCard>
  )
}

export default StudentResultList
