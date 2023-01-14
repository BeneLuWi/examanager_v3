import React, { FunctionComponent } from "react"
import { Card } from "react-bootstrap"
import { Exam } from "../types"
import TaskItem from "./TaskItem"

type TaskListProps = {
  exam: Exam
}

const TaskList: FunctionComponent<TaskListProps> = ({ exam }) => {
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
    <Card>
      <Card.Body>
        <Card.Title>
          <i className="bi bi-check2-square" /> Aufgaben
        </Card.Title>

        {exam.tasks?.map((task) => (
          <TaskItem key={task._id} exam={exam} task={task} />
        ))}
      </Card.Body>
    </Card>
  )
}

export default TaskList
