import React, { FunctionComponent, useCallback, useEffect, useState } from "react"
import { Exam, ExamContextType } from "./types"
import axios from "axios"
import { toast } from "react-toastify"
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

  const [exams, setExams] = useState<Exam[]>()

  const examsQuery = useFetchExams()

  const updateExams = useCallback(() => {
    axios
      .get("api/exam")
      .then((res) => setExams(res.data))
      .catch(() => toast("Fehler beim Laden Klausuren", { type: "error" }))
  }, [])

  useEffect(() => {
    updateExams()
  }, [updateExams])

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
    <ExamContext.Provider value={{ exams: examsQuery.data, updateExams }}>
      <div className="display-4">Klausuren</div>
      <Row>
        <Col xs={8}>
          <ExamsList />
        </Col>
        <Col>
          <NewExam />
        </Col>
      </Row>
    </ExamContext.Provider>
  )
}

export default Exams
