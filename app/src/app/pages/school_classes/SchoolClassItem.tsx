import React, { FunctionComponent, useState } from "react"
import { SchoolClass } from "./types"
import { Button, ListGroup } from "react-bootstrap"
import ModalWrapper from "../../components/modal-wrapper/ModalWrapper"

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
        {schoolClass.name} : {schoolClass.description}
      </ListGroup.Item>

      <ModalWrapper
        fullscreen={true}
        show={edit}
        close={close}
        title={`Klasse ${schoolClass.name} bearbeiten`}
      ></ModalWrapper>
    </>
  )
}

export default SchoolClassItem
