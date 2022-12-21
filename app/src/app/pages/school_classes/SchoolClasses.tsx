import React, { FunctionComponent } from "react"
import NewSchoolClass from "./NewSchoolClass"
import SchoolClassList from "./SchoolClassList"
import { Col, Row } from "react-bootstrap"

type SchoolClassesProps = {}

const SchoolClasses: FunctionComponent<SchoolClassesProps> = ({}) => {
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
    <div>
      <div className="page-header">Klassen</div>
      <Row>
        <Col xs={8}>
          <SchoolClassList />
        </Col>
        <Col>
          <NewSchoolClass />
        </Col>
      </Row>
    </div>
  )
}

export default SchoolClasses
