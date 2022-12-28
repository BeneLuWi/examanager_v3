import React, { FunctionComponent } from "react"
import { useFetchExams } from "../../exams/api"
import SelectorItem from "./SelectorItem"
import { Row } from "react-bootstrap"

type SelectorProps = {}

const Selector: FunctionComponent<SelectorProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { data: exams } = useFetchExams()

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
    <Row className="justify-content-start gap-5">
      {exams?.map((exam) => (
        <SelectorItem key={exam._id} {...{ exam }} />
      ))}
    </Row>
  )
}

export default Selector
