import React, { FunctionComponent } from "react"
import { Student } from "../school_classes/types"
import { ListGroup } from "react-bootstrap"

type StudentResultItemProps = {
  student: Student
}

const StudentResultItem: FunctionComponent<StudentResultItemProps> = ({ student }) => {
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
    <ListGroup.Item action>
      <div>
        <div>
          {student.firstname} {student.lastname}
        </div>
      </div>
    </ListGroup.Item>
  )
}

export default StudentResultItem
