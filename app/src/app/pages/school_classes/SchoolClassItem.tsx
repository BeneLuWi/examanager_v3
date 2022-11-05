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

  const [edit, setEdit] = useState(false)

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/
  const close = () => setEdit(false)
  const open = () => setEdit(true)

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <>
      <ListGroup.Item action onClick={open}>
        <div className="me-auto">
          <div className="fw-bold">{schoolClass.name}</div>
          {schoolClass.description}
        </div>
      </ListGroup.Item>

      <DrawerModal show={edit} close={close}>
        <div className="display-5">{schoolClass.name}</div>
        <StudentList schoolClass={schoolClass} />
      </DrawerModal>
    </>
  )
}

export default SchoolClassItem
