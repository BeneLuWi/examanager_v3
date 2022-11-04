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
    <Card>
      <Card.Body>
        <Card.Title>Liste der Schulklassen</Card.Title>
        <ListGroup>
          {schoolClasses?.map((schoolClass) => (
            <SchoolClassItem key={schoolClass._id} schoolClass={schoolClass} />
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

export default SchoolClassList
