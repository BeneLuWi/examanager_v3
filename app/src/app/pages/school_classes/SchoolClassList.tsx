import React, { FunctionComponent } from "react"
import { Card, ListGroup } from "react-bootstrap"
import SchoolClassItem from "./SchoolClassItem"
import { useFetchSchoolClasses } from "./api"
import ListGroupCard from "../../components/list-group-card/ListGroupCard"

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
    <ListGroupCard>
      <Card.Title>
        <i className="bi bi-people" /> Meine Klassen
      </Card.Title>
      {schoolClasses?.map((schoolClass) => (
        <SchoolClassItem key={schoolClass._id} schoolClass={schoolClass} />
      ))}
    </ListGroupCard>
  )
}

export default SchoolClassList
