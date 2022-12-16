import React, { FunctionComponent } from "react"
import { ListGroup } from "react-bootstrap"
import SchoolClassItem from "./SchoolClassItem"
import { useFetchSchoolClasses } from "./api"

type SchoolClassListProps = {}

const SchoolClassList: FunctionComponent<SchoolClassListProps> = () => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { data: schoolClasses } = useFetchSchoolClasses()

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
