import React, { FunctionComponent, useEffect, useState } from "react"
import { useStatisticsContext } from "../Statistics"
import DrawerModal from "../../../components/drawer-modal/DrawerModal"
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap"
import { useFetchResults } from "../../results/api"
import MeanPoints from "../graphs/MeanPoints"
import StudentResultList from "../graphs/StudentResultList"
import MedianPoints from "../graphs/MedianPoints"
import Difficulty from "../graphs/Difficulty"
import Correlation from "../graphs/Correlation"
import MeanMSS from "../graphs/MeanMSS"
import MedianMSS from "../graphs/MedianMSS"
import StandardDeviation from "../graphs/StandardDeviation"
import SchoolClassComposition from "../graphs/SchoolClassComposition"
import SelfAssessment from "../graphs/SelfAssessment"
import ExamDetails from "../graphs/ExamDetails"
import LetterIcon from "../../../components/letter-icon/LetterIcon"

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
      {exam && schoolClass && studentResults && (
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
              <Col xs={6}>
                <Card>
                  <Card.Body style={{ height: 250 }}>
                    <Card.Title>
                      <i className="bi bi-people-fill" /> Zusammenstellung
                    </Card.Title>
                    <SchoolClassComposition students={studentResults.studentResults} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mt-4">
              <ExamDetails exam={exam} />
            </Row>

            <Row className="mt-4">
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>Legende</Card.Title>
                    <div className="d-flex justify-content-evenly">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-exa-bright me-1" style={{ width: "2rem", height: "2rem" }} />
                        Gesamt
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-exa-green me-1" style={{ width: "2rem", height: "2rem" }} />
                        Männlich
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-exa-red me-1" style={{ width: "2rem", height: "2rem" }} />
                        Weiblich
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-exa-purple me-1" style={{ width: "2rem", height: "2rem" }} />
                        Divers
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col xs={6}>
                <MeanMSS />
              </Col>
              <Col xs={6}>
                <MedianMSS />
              </Col>
            </Row>

            <Row className="mt-4">
              <Col xs={6}>
                <MeanPoints />
              </Col>
              <Col xs={6}>
                <MedianPoints />
              </Col>
            </Row>

            <Row className="mt-4">
              <Col xs={6}>
                <StandardDeviation />
              </Col>
              <Col xs={6}>
                <SelfAssessment />
              </Col>
            </Row>

            <Row className="mt-4">
              <Col xs={6}>
                <Difficulty />
              </Col>
              <Col xs={6}>
                <Correlation />
              </Col>
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
