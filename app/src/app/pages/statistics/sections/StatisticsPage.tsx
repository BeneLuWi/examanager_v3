import React, { FunctionComponent, useEffect, useState } from "react"
import { useStatisticsContext } from "../Statistics"
import DrawerModal from "../../../components/drawer-modal/DrawerModal"
import { Button, Card, Col, Row } from "react-bootstrap"
import { useFetchResults } from "../../results/api"
import SchoolClassComposition from "../graphs/SchoolClassComposition"
import AverageGrade from "../graphs/AverageGrade"
import StudentResultList from "../graphs/StudentResultList"

type StatisticsPageProps = {}

const StatisticsPage: FunctionComponent<StatisticsPageProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { exam, schoolClass, setExam, setSchoolClass } = useStatisticsContext()
  const [show, setShow] = useState(false)
  const { data: studentResults } = useFetchResults(schoolClass?._id, exam?._id)

  useEffect(() => {
    if (exam && schoolClass) {
      setShow(true)
    }
  }, [exam, schoolClass])

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const close = () => {
    setShow(false)
    setExam(undefined)
    setSchoolClass(undefined)
  }

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <DrawerModal {...{ show, close }}>
      {exam && schoolClass && (
        <div className="h-100">
          <h2>
            Klausurergebnisse für {exam.name} von {schoolClass.name}
          </h2>
          <div className="h-100 p-3" style={{ overflowY: "scroll" }}>
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>
                      <i className="bi bi-people-fill" /> Klasse
                    </Card.Title>
                    <p>
                      <div className="fw-bold">{schoolClass.name}</div>
                      {schoolClass.description}
                    </p>
                    <p>
                      <i className="bi bi-people" /> {studentResults?.studentResults.length} Schüler:innen
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>
                      <i className="bi bi-list-check" /> Klausur
                    </Card.Title>
                    <p>
                      <div className="fw-bold">{exam.name}</div>
                      {exam.description}
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
            <Row className="mt-4">
              <Col xs={6}>
                <AverageGrade />
              </Col>
              <Col />
            </Row>

            <Row className="mt-4">
              <Col>
                <StudentResultList />
              </Col>
            </Row>
          </div>
        </div>
      )}
    </DrawerModal>
  )
}

export default StatisticsPage
