import React, { FunctionComponent, useEffect, useState } from "react"
import { Exam } from "../exams/types"
import { SchoolClass } from "../school_classes/types"
import { Col, ListGroup, Row } from "react-bootstrap"
import axios from "axios"
import { toast } from "react-toastify"
import { ResultContextType } from "./types"
import ResultEntry from "./ResultEntry"
import ExamSelector from "./ExamSelector"

type ResultsProps = {
  schoolClass: SchoolClass
}

const ResultContext = React.createContext<ResultContextType>(null!)

export const useResultContext = () => React.useContext(ResultContext)

const Results: FunctionComponent<ResultsProps> = ({ schoolClass }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [exam, setExam] = useState<Exam>()

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
    <ResultContext.Provider value={{ exam, schoolClass }}>
      <div className="display-5">Klausuren</div>
      <ExamSelector setExam={setExam} />
      <ResultEntry />
    </ResultContext.Provider>
  )
}

export default Results
