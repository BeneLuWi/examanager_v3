import React, { FunctionComponent, useState } from "react"
import { Exam, Task } from "../types"
import { Button, ListGroup } from "react-bootstrap"
import ModalWrapper from "../../../components/modal-wrapper/ModalWrapper"
import Form from "react-bootstrap/Form"
import { toast } from "react-toastify"
import axios from "axios"
import { useExamContext } from "../Exams"
import ConfirmButton from "../../../components/confirm-button/ConfirmButton"

type TaskItemProps = {
  exam: Exam
  task: Task
}

const TaskItem: FunctionComponent<TaskItemProps> = ({ exam, task }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [edit, setEdit] = useState(false)

  const { updateExams } = useExamContext()

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const close = () => setEdit(false)
  const open = () => setEdit(true)

  const deleteTask = () => {
    axios
      .put("api/exam", {
        ...exam,
        tasks: exam.tasks.filter((t) => t._id !== task._id),
      })
      .then(() => {
        updateExams()
        close()
      })
      .catch(() => toast("Fehler beim Löschen", { type: "error" }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    let formData = new FormData(event.currentTarget)
    let name = formData.get("name") as string
    let max_points = formData.get("max_points") as unknown as number

    axios
      .put("api/exam", {
        ...exam,
        tasks: exam.tasks.map((t) =>
          t._id === task._id
            ? {
                ...task,
                name,
                max_points,
              }
            : t
        ),
      })
      .then(() => {
        updateExams()
        // @ts-ignore
        event.target.reset()
        close()
      })
      .catch(() => toast("Fehler beim bearbeiten", { type: "error" }))
  }

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <>
      <ListGroup.Item action onClick={open}>
        <div>
          <div className="fw-bold">{task.name}</div>
          <i className="bi bi-patch-check" /> {task.max_points} Punkte erreichbar
        </div>
      </ListGroup.Item>
      <ModalWrapper size="lg" show={edit} close={close} title={`${task.name} bearbeiten`}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" type="text" placeholder="Name" defaultValue={task.name} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Beschreibung</Form.Label>
            <Form.Control name="max_points" type="number" defaultValue={task.max_points} />
          </Form.Group>
          <Button variant="primary" type="submit" className="me-2">
            Speichern
          </Button>
          <ConfirmButton onSuccess={deleteTask} question={`${task.name} löschen?`}>
            Aufgabe Löschen
          </ConfirmButton>
        </Form>
      </ModalWrapper>
    </>
  )
}

export default TaskItem
