import React, { FunctionComponent } from "react"
import { Exam } from "../../exams/types"
import { Card, Col, ListGroup } from "react-bootstrap"
import RatingList from "./RatingList"
import EditExamButton from "../../exams/EditExamButton"

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
    <>
      <Col xs={4}>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="bi bi-list-check" /> Klausur
            </Card.Title>
            <p>
              <span className="fw-bold">{exam.name}</span>
              <br />
              {exam.description}
            </p>
            <p>
              <i className="bi bi-patch-check" /> {exam.tasks.reduce((a, b) => a + b.max_points, 0)} Punkte
            </p>
            <p>
              <i className="bi bi-check2-square" /> {exam.tasks.length} Aufgaben
            </p>
            {<EditExamButton exam={exam} />}
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="bi bi-mortarboard-fill" /> Bewertung
            </Card.Title>
            <div className="d-flex">
              <div className="d-flex flex-fill justify-content-evenly">
                <ListGroup>
                  <RatingList ratings={exam.ratings.slice(1, 6)} />
                </ListGroup>
                <ListGroup>
                  <RatingList ratings={exam.ratings.slice(6, 11)} />
                </ListGroup>
                <ListGroup>
                  <RatingList ratings={exam.ratings.slice(11, 16)} />
                </ListGroup>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  )
}

export default ExamDetails
