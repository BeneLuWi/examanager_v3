import React, { FunctionComponent, useEffect, useState } from "react"
import { SchoolClass, SchoolClassContextType } from "./types"
import NewSchoolClass from "./NewSchoolClass"
import SchoolClassList from "./SchoolClassList"
import axios from "axios"
import { toast } from "react-toastify"
import { Col, Row } from "react-bootstrap"

type SchoolClassesProps = {}

const SchoolClassContext = React.createContext<SchoolClassContextType>(null!)

export const useSchoolClassContext = () => React.useContext(SchoolClassContext)

const SchoolClasses: FunctionComponent<SchoolClassesProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [schoolClasses, setSchoolClasses] = useState<SchoolClass[]>()

  useEffect(() => {
    updateSchoolClasses()
  }, [])

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const updateSchoolClasses = () =>
    axios
      .get("api/school_class")
      .then((res) => setSchoolClasses(res.data))
      .catch(() => toast("Fehler beim Laden Klassen", { type: "error" }))

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <SchoolClassContext.Provider value={{ schoolClasses, updateSchoolClasses }}>
      <div className="page-header">Klassen</div>
      <Row>
        <Col xs={8}>
          <SchoolClassList />
        </Col>
        <Col>
          <NewSchoolClass />
        </Col>
      </Row>
    </SchoolClassContext.Provider>
  )
}

export default SchoolClasses
