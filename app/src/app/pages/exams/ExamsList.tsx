import React, { FunctionComponent } from "react"
import { Card, ListGroup } from "react-bootstrap"
import ExamsListItem from "./ExamsListItem"
import { useFetchExams } from "./api"
import ListGroupCard from "../../components/list-group-card/ListGroupCard"

type ExamsListProps = {}

const ExamsList: FunctionComponent<ExamsListProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { data: examList } = useFetchExams()

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
    <ListGroupCard>
      <Card.Title>
        <i className="bi bi-list-check" /> Meine Klausuren
      </Card.Title>
      {examList?.map((exam) => (
        <ExamsListItem key={exam._id} exam={exam} />
      ))}
    </ListGroupCard>
  )
}

export default ExamsList
