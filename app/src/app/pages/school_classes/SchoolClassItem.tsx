import React, { FunctionComponent, useState } from "react"
import { SchoolClass } from "./types"
import { Button, ListGroup } from "react-bootstrap"
import DrawerModal from "../../components/drawer-modal/DrawerModal"
import StudentList from "./students/StudentList"

type SchoolClassItemProps = {
  schoolClass: SchoolClass
}

const SchoolClassItem: FunctionComponent<SchoolClassItemProps> = ({ schoolClass }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [editSchoolClass, setEditSchoolClass] = useState(false)

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/
  const closeEditSchoolClass = () => setEditSchoolClass(false)
  const openEditSchoolClass = () => setEditSchoolClass(true)

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <>
      <ListGroup.Item>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-bold">{schoolClass.name}</div>
            {schoolClass.description}
          </div>
          <div>
            <Button size="sm" variant="info" className="me-2" onClick={openEditSchoolClass}>
              <i className="bi bi-list-check" /> Klausurergebnisse
            </Button>
            <Button size="sm" variant="primary" onClick={openEditSchoolClass}>
              <i className="bi bi-people" /> Klasse bearbeiten
            </Button>
          </div>
        </div>
      </ListGroup.Item>

      <DrawerModal show={editSchoolClass} close={closeEditSchoolClass}>
        <div className="display-5">{schoolClass.name}</div>
        <StudentList schoolClass={schoolClass} />
      </DrawerModal>
    </>
  )
}

export default SchoolClassItem
