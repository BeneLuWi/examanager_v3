import React, { FunctionComponent } from "react"
import { ExamContextType } from "./types"
import ExamsList from "./ExamsList"
import { Col, Row } from "react-bootstrap"
import NewExam from "./NewExam"
import { useFetchExams } from "./api"

type ExamsProps = {}

const ExamContext = React.createContext<ExamContextType>(null!)

export const useExamContext = () => React.useContext(ExamContext)

const Exams: FunctionComponent<ExamsProps> = ({}) => {
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
    <div>
      <div className="page-header">Klausuren</div>
      <Row>
        <Col xs={8}>
          <ExamsList />
        </Col>
        <Col>
          <NewExam />
        </Col>
      </Row>
    </div>
  )
}

export default Exams
