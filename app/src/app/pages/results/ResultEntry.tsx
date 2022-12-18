import React, { FunctionComponent } from "react"
import { useResultContext } from "./Results"
import DrawerModal from "../../components/drawer-modal/DrawerModal"
import { Card, Col, ListGroup, Row } from "react-bootstrap"
import StudentResultItem from "./StudentResultItem"
import { useFetchResults } from "./api"

type ResultEntryProps = {}

const ResultEntry: FunctionComponent<ResultEntryProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { exam, schoolClass, setExam } = useResultContext()

  const { isSuccess, isIdle, data: examResults } = useFetchResults(schoolClass?._id, exam?._id)
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
  if (isIdle || !examResults) return <div>Loading</div>
  return (
    <DrawerModal show={isSuccess} close={close}>
      <div className="display-5">
        {schoolClass?.name} - {exam?.name}
      </div>
      <Row>
        <Col xs={8}>
          <ListGroup>
            {examResults.studentResults.map((studentResultsResponse) => (
              <StudentResultItem
                key={studentResultsResponse._id}
                studentResultsResponse={studentResultsResponse}
                exam={examResults.exam}
              />
            ))}
          </ListGroup>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>
                <i className="bi bi-info-circle" /> Klausur
              </Card.Title>
              <p>
                <div>
                  <div className="fw-bold">{examResults.exam.name}</div>
                  {examResults.exam.description}
                </div>
              </p>
              <p>
                <i className="bi bi-patch-check" /> {examResults.exam.tasks.reduce((a, b) => a + b.max_points, 0)}{" "}
                Punkte
              </p>
              <p>
                <i className="bi bi-check2-square" /> {examResults.exam.tasks.length} Aufgaben
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DrawerModal>
  )
}

export default ResultEntry
