import React, { createContext, FunctionComponent, useContext, useState } from "react"
import Selector from "./sections/Selector"
import { StatisticsContextType } from "./types"
import { Exam } from "../exams/types"
import { SchoolClass } from "../school_classes/types"
import StatisticsPage from "./sections/StatisticsPage"

type StatisticsProps = {}

const StatisticsContext = createContext<StatisticsContextType>(null!)

export const useStatisticsContext = () => useContext(StatisticsContext)

const Statistics: FunctionComponent<StatisticsProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/
  const [exam, setExam] = useState<Exam>()
  const [schoolClass, setSchoolClass] = useState<SchoolClass>()
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
    <StatisticsContext.Provider value={{ exam, setExam, schoolClass, setSchoolClass }}>
      <div className="page-header">Statistiken</div>
      <Selector />
      <StatisticsPage />
    </StatisticsContext.Provider>
  )
}

export default Statistics
