import React, { FunctionComponent, useState } from "react"
import { Exam, Task } from "../types"
import { Button, ListGroup } from "react-bootstrap"
import ModalWrapper from "../../../components/modal-wrapper/ModalWrapper"
import Form from "react-bootstrap/Form"
import ConfirmButton from "../../../components/confirm-button/ConfirmButton"
import { useUpdateExam } from "../api"
import { FieldValues, useForm } from "react-hook-form"

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

  const { register, handleSubmit, reset } = useForm()

  const { mutate: updateExam } = useUpdateExam()

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const close = () => setEdit(false)
  const open = () => setEdit(true)

  const deleteTask = () => {
    updateExam(
      {
        ...exam,
        tasks: exam.tasks.filter((t) => t._id !== task._id),
      },
      {
        onSuccess: () => close(),
      }
    )
  }

  const performUpdate = (values: FieldValues) => {
    updateExam(
      {
        ...exam,
        tasks: exam.tasks.map((t) =>
          t._id === task._id
            ? {
                ...task,
                ...values,
              }
            : t
        ),
      },
      {
        onSuccess: () => {
          reset()
          close()
        },
      }
    )
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
        <Form onSubmit={handleSubmit((values) => performUpdate(values))}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control {...register("name")} type="text" placeholder="Name" defaultValue={task.name} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Beschreibung</Form.Label>
            <Form.Control {...register("max_points")} type="number" defaultValue={task.max_points} />
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
