import React, { FunctionComponent } from "react"
import { SchoolClass } from "./types"
import { ListGroup } from "react-bootstrap"

type SchoolClassItemProps = {
  schoolClass: SchoolClass
}

const SchoolClassItem: FunctionComponent<SchoolClassItemProps> = ({ schoolClass }) => {
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
    <>
      <ListGroup.Item action>
        {schoolClass.name} : {schoolClass.description}
      </ListGroup.Item>
    </>
  )
}

export default SchoolClassItem
