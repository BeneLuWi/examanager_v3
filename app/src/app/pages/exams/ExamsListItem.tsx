import React, { FunctionComponent } from "react"
import { Exam } from "./types"
import { ListGroup } from "react-bootstrap"

type ExamsListItemProps = {
  exam: Exam
}

const ExamsListItem: FunctionComponent<ExamsListItemProps> = ({ exam }) => {
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
    <ListGroup.Item action>
      {exam.name} : {exam.description}
    </ListGroup.Item>
  )
}

export default ExamsListItem
