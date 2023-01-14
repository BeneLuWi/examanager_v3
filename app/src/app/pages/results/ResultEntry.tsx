import React, { FunctionComponent, useEffect, useState } from "react"
import { useResultContext } from "./StudentResultList"
import DrawerModal from "../../components/drawer-modal/DrawerModal"
import { Card, Col, InputGroup, ListGroup, Row } from "react-bootstrap"
import StudentResultItem from "./StudentResultItem"
import { useFetchResults } from "./api"
import ListGroupCard from "../../components/list-group-card/ListGroupCard"
import Form from "react-bootstrap/Form"

type ResultEntryProps = {}

const ResultEntry: FunctionComponent<ResultEntryProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { exam, schoolClass, setExam } = useResultContext()
  const { data: examResults } = useFetchResults(schoolClass?._id, exam?._id)

  const [name, setName] = useState("")
  const [foundStudentResults, setFoundStudentResults] = useState(examResults?.studentResults)

  useEffect(() => {
    if (!name.length) {
      setFoundStudentResults(examResults?.studentResults)
    }
    setFoundStudentResults(
      examResults?.studentResults.filter(
        (student) => student.firstname.toLowerCase().includes(name) || student.lastname.toLowerCase().includes(name)
      )
    )
  }, [name, examResults])

  // Reset on Unmount
  useEffect(() => () => setName(""), [])

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

  const deactivatedTasks = examResults?.exam.tasks.filter(
    ({ deactivated_for }) => schoolClass && deactivated_for?.includes(schoolClass._id)
  )

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
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <i className="bi bi-search" />
              </InputGroup.Text>
              <Form.Control
                onChange={(event) => setName(event.target.value)}
                value={name}
                placeholder="Suche"
                aria-label="Name"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
            {examResults &&
              foundStudentResults?.map((studentResultsResponse) => (
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
                <span className="fw-bold">{examResults?.exam.name}</span>
                <br />
                {examResults?.exam.description}
              </p>
              <p>
                <i className="bi bi-patch-check" /> {deactivatedTasks?.reduce((a, b) => a + b.max_points, 0)} Punkte
              </p>
              <p>
                <i className="bi bi-check2-square" /> {examResults?.exam.tasks.length} Aufgaben
              </p>
              {!!deactivatedTasks?.length && (
                <p>
                  <i className="bi bi-slash-circle" /> {deactivatedTasks.length} Aufgabe deaktiviert
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DrawerModal>
  )
}

export default ResultEntry
