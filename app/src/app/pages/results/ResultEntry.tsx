import React, { FunctionComponent, useState } from "react"
import { useResultContext } from "./StudentResultList"
import DrawerModal from "../../components/drawer-modal/DrawerModal"
import { Card, Col, ListGroup, Row } from "react-bootstrap"
import StudentResultItem from "./StudentResultItem"
import { useFetchResults } from "./api"
import ListGroupCard from "../../components/list-group-card/ListGroupCard"

type ResultEntryProps = {}

const ResultEntry: FunctionComponent<ResultEntryProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { exam, schoolClass, setExam } = useResultContext()
  const { data: examResults } = useFetchResults(schoolClass?._id, exam?._id)
  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const close = () => {
    setExam(undefined)
  }

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/
  return (
    <DrawerModal show={!!exam} close={close}>
      <div className="page-header">
        {schoolClass?.name} - {exam?.name}
      </div>
      <Row className="h-100 pt-3 pb-3" style={{ overflowY: "scroll" }}>
        <Col xs={8}>
          <ListGroupCard>
            <Card.Title>
              <i className="bi bi-people" /> Schüler:innen in {schoolClass?.name}
            </Card.Title>
            {examResults?.studentResults.map((studentResultsResponse) => (
              <StudentResultItem
                key={studentResultsResponse._id}
                studentResultsResponse={studentResultsResponse}
                exam={examResults.exam}
              />
            ))}
          </ListGroupCard>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>
                <i className="bi bi-info-circle" /> Klausur
              </Card.Title>
              <p>
                <div>
                  <div className="fw-bold">{examResults?.exam.name}</div>
                  {examResults?.exam.description}
                </div>
              </p>
              <p>
                <i className="bi bi-patch-check" /> {examResults?.exam.tasks.reduce((a, b) => a + b.max_points, 0)}{" "}
                Punkte
              </p>
              <p>
                <i className="bi bi-check2-square" /> {examResults?.exam.tasks.length} Aufgaben
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DrawerModal>
  )
}

export default ResultEntry
