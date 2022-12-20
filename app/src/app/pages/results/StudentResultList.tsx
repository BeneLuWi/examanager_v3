import React, { FunctionComponent, useEffect, useState } from "react"
import { Exam } from "../exams/types"
import { SchoolClass } from "../school_classes/types"
import { ResultContextType } from "./types"
import ResultEntry from "./ResultEntry"
import ExamSelector from "./ExamSelector"

type ResultsProps = {
  schoolClass: SchoolClass
}

const ResultContext = React.createContext<ResultContextType>(null!)

export const useResultContext = () => React.useContext(ResultContext)

const StudentResultList: FunctionComponent<ResultsProps> = ({ schoolClass }) => {
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
    <ResultContext.Provider value={{ exam, schoolClass, setExam }}>
      <div className="display-5">Klausuren</div>
      <ExamSelector />
      <ResultEntry />
    </ResultContext.Provider>
  )
}

export default StudentResultList
