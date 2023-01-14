import React, { FunctionComponent, useState } from "react"
import DrawerModal from "../../components/drawer-modal/DrawerModal"
import ExamOverview from "./exam-overview/ExamOverview"
import { Exam } from "./types"
import { Button } from "react-bootstrap"

type EditExamButtonProps = {
  exam: Exam
}

const EditExamButton: FunctionComponent<EditExamButtonProps> = ({ exam }) => {
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
      <Button onClick={open}>{exam.name} bearbeiten</Button>
      <DrawerModal show={edit} close={close}>
        <div className="page-header">{exam.name}</div>
        <ExamOverview exam={exam} />
      </DrawerModal>
    </>
  )
}

export default EditExamButton
