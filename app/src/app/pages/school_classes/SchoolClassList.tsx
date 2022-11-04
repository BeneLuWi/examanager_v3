import React, { FunctionComponent } from "react"
import { useSchoolClassContext } from "./SchoolClasses"
import { Card, ListGroup } from "react-bootstrap"
import SchoolClassItem from "./SchoolClassItem"

type SchoolClassListProps = {}

const SchoolClassList: FunctionComponent<SchoolClassListProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { schoolClasses } = useSchoolClassContext()

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
    <ListGroup>
      {schoolClasses?.map((schoolClass) => (
        <SchoolClassItem key={schoolClass._id} schoolClass={schoolClass} />
      ))}
    </ListGroup>
  )
}

export default SchoolClassList
