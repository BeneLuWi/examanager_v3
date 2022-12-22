import React, { FunctionComponent, useState } from "react"
import { SchoolClass } from "./types"
import { Button, ListGroup } from "react-bootstrap"
import DrawerModal from "../../components/drawer-modal/DrawerModal"
import StudentList from "./students/StudentList"
import StudentResultList from "../results/StudentResultList"
import LetterIcon from "../../components/letter-icon/LetterIcon"

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
  const [editResults, setEditResults] = useState(false)

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/
  const closeEditSchoolClass = () => setEditSchoolClass(false)
  const openEditSchoolClass = () => setEditSchoolClass(true)
  const openEditResults = () => setEditResults(true)
  const closeEditResults = () => setEditResults(false)

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <>
      <ListGroup.Item className="d-flex justify-content-between align-items-center" action>
        <div className="d-flex">
          <LetterIcon name={schoolClass.name} id={schoolClass._id} />
          <div>
            <div className="fw-bold">{schoolClass.name}</div>
            {schoolClass.description}
          </div>
        </div>
        <div>
          <Button size="sm" variant="info" className="me-2" onClick={openEditResults}>
            <i className="bi bi-list-check" /> Klausurergebnisse
          </Button>
          <Button size="sm" variant="primary" onClick={openEditSchoolClass}>
            <i className="bi bi-people" /> Klasse bearbeiten
          </Button>
        </div>
      </ListGroup.Item>

      <DrawerModal show={editSchoolClass} close={closeEditSchoolClass}>
        <div className="page-header">{schoolClass.name}</div>
        <StudentList schoolClass={schoolClass} />
      </DrawerModal>

      <DrawerModal show={editResults} close={closeEditResults}>
        <div className="page-header">{schoolClass.name}</div>
        <StudentResultList schoolClass={schoolClass} />
      </DrawerModal>
    </>
  )
}

export default SchoolClassItem
