import React, { FunctionComponent } from "react"
import { ListGroup } from "react-bootstrap"
import ExamsListItem from "./ExamsListItem"
import { useFetchExams } from "./api"

type ExamsListProps = {}

const ExamsList: FunctionComponent<ExamsListProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const examsQuery = useFetchExams()

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
    <ListGroup>
      {examsQuery.data?.map((exam) => (
        <ExamsListItem key={exam._id} exam={exam} />
      ))}
    </ListGroup>
  )
}

export default ExamsList
