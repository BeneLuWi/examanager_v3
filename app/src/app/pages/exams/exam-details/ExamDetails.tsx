import React, { FunctionComponent } from "react"
import { Col, Row } from "react-bootstrap"
import { Exam } from "../types"
import RatingList from "./RatingList"
import TaskList from "./TaskList"
import NewTask from "./NewTask"
import TaskDetails from "./TaskDetails"

type ExamDetailsProps = {
  exam: Exam
}

const ExamDetails: FunctionComponent<ExamDetailsProps> = ({ exam }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

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
    <Row>
      <Col xs={6}>
        <RatingList exam={exam} />
      </Col>
      <Col xs={3}>
        <TaskList exam={exam} />
      </Col>
      <Col>
        <NewTask exam={exam} />
        <TaskDetails exam={exam} />
      </Col>
    </Row>
  )
}

export default ExamDetails
