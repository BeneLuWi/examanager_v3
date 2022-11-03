import React, { FunctionComponent } from "react"
import { ListGroup } from "react-bootstrap"
import ExamsListItem from "./ExamsListItem"
import { useExamContext } from "./Exams"

type ExamsListProps = {}

const ExamsList: FunctionComponent<ExamsListProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { exams } = useExamContext()

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
      {exams?.map((exam) => (
        <ExamsListItem key={exam._id} exam={exam} />
      ))}
    </ListGroup>
  )
}

export default ExamsList
