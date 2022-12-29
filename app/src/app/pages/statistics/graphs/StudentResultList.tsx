import React, { FunctionComponent, useState } from "react"
import { useStatisticsContext } from "../Statistics"
import { useFetchResults } from "../../results/api"
import { GradeMode, gradesModeList } from "../types"
import StudentResultItem from "./StudentResultItem"
import Table from "react-bootstrap/Table"
import ExpandableCard from "../../../components/expandable-card/ExpandableCard"
import { Button } from "react-bootstrap"

type StudentResultListProps = {}

const StudentResultList: FunctionComponent<StudentResultListProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { exam, schoolClass } = useStatisticsContext()
  const { data: examResults } = useFetchResults(schoolClass?._id, exam?._id)
  const [mode, setMode] = useState(0)
  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const nextMode = () => setMode((mode + 1) % gradesModeList.length)

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <ExpandableCard title="Ergebnisse">
      <div className="pt-2 pb-2">
        <Button onClick={nextMode}>
          <i className="bi bi-mortarboard" /> Notenformat ändern
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nachname</th>
            <th>Vorname</th>
            <th>Geschlecht</th>
            <th>Note</th>
            <th>Gesamt</th>
            {exam?.tasks.map((task) => (
              <th key={task._id}>{task.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {examResults &&
            examResults.studentResults.map((studentResult) => (
              <StudentResultItem
                key={studentResult._id}
                studentResultsResponse={studentResult}
                mode={gradesModeList[mode]}
              />
            ))}
        </tbody>
      </Table>
    </ExpandableCard>
  )
}

export default StudentResultList
