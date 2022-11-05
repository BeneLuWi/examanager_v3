import React, { FunctionComponent, useEffect, useState } from "react"
import { Exam } from "../exams/types"
import { SchoolClass } from "../school_classes/types"
import { Col, ListGroup, Row } from "react-bootstrap"
import axios from "axios"
import { toast } from "react-toastify"
import DrawerModal from "../../components/drawer-modal/DrawerModal"

type ResultsProps = {}

const Results: FunctionComponent<ResultsProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [exams, setExams] = useState<Exam[]>()
  const [school_classes, setSchoolClasses] = useState<SchoolClass[]>()

  const [exam, setExam] = useState<Exam>()
  const [school_class, setSchoolClass] = useState<SchoolClass>()

  useEffect(() => {
    axios
      .get("/api/school_class")
      .then((res) => setSchoolClasses(res.data))
      .catch(() => toast("Fehler beim Laden der Schulklassen", { type: "error" }))

    axios
      .get("/api/exam")
      .then((res) => setExams(res.data))
      .catch(() => toast("Fehler beim Laden der Klausuren", { type: "error" }))
  }, [])

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
      <div className="display-4">Klausurergebnisse</div>
      <Row>
        <Col>
          <ListGroup>
            {school_classes?.map((s) => (
              <ListGroup.Item
                key={s._id}
                action
                onClick={() => setSchoolClass(s)}
                className={`${s._id === school_class?._id && "border border-3 border-primary"}`}
              >
                <div>
                  <div className="fw-bold">{s.name}</div>
                  {s.description}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col>
          <ListGroup>
            {exams?.map((e) => (
              <ListGroup.Item
                key={e._id}
                action
                onClick={() => setExam(e)}
                className={`${e._id === exam?._id && "border border-3 border-primary"}`}
              >
                <div>
                  <div className="fw-bold">{e.name}</div>
                  {e.description}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </>
  )
}

export default Results
