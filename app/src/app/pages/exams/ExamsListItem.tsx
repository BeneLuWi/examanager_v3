import React, { FunctionComponent, useState } from "react"
import { Exam } from "./types"
import { ListGroup } from "react-bootstrap"
import DrawerModal from "../../components/drawer-modal/DrawerModal"
import ExamOverview from "./exam-details/ExamOverview"
import LetterIcon from "../../components/letter-icon/LetterIcon"

type ExamsListItemProps = {
  exam: Exam
}

const ExamsListItem: FunctionComponent<ExamsListItemProps> = ({ exam }) => {
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
      <ListGroup.Item action onClick={open} className="d-flex">
        <LetterIcon name={exam.name} id={exam._id} />
        <div>
          <div className="fw-bold">{exam.name}</div>
          {exam.description}
        </div>
      </ListGroup.Item>

      <DrawerModal show={edit} close={close}>
        <div className="page-header">{exam.name}</div>
        <ExamOverview exam={exam} />
      </DrawerModal>
    </>
  )
}

export default ExamsListItem
