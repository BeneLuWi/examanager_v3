import React, { FunctionComponent, useEffect, useState } from "react"
import { useResultContext } from "./Results"
import DrawerModal from "../../components/drawer-modal/DrawerModal"
import { Student } from "../school_classes/types"
import axios from "axios"
import { toast } from "react-toastify"
import { Card, Col, ListGroup, Row } from "react-bootstrap"
import StudentResultItem from "./StudentResultItem"

type ResultEntryProps = {}

const ResultEntry: FunctionComponent<ResultEntryProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { exam, schoolClass, setExam, setSchoolClass } = useResultContext()
  const [show, setShow] = useState(false)

  const [students, setStudents] = useState<Student[]>()

  useEffect(() => {
    if (exam && schoolClass) {
      setShow(true)
      axios
        .get(`api/student/${schoolClass._id}`)
        .then((res) => setStudents(res.data))
        .catch((err) => toast("Fehler beim Laden", { type: "error" }))
    }
  }, [exam, schoolClass])

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const close = () => setShow(false)

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/
  if (!exam || !schoolClass) return <div />
  return (
    <DrawerModal show={show} close={close}>
      <div className="display-5">
        {schoolClass?.name} - {exam?.name}
      </div>
      <Row>
        <Col xs={8}>
          <ListGroup>
            {students?.map((student) => (
              <StudentResultItem key={student._id} student={student} />
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
                  <div className="fw-bold">{exam.name}</div>
                  {exam.description}
                </div>
              </p>
              <p>
                <i className="bi bi-patch-check" /> {exam.tasks.reduce((a, b) => a + b.max_points, 0)} Punkte
              </p>
              <p>
                <i className="bi bi-check2-square" /> {exam.tasks.length} Aufgaben
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DrawerModal>
  )
}

export default ResultEntry
