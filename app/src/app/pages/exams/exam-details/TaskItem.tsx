import React, { FunctionComponent, useEffect, useReducer, useState } from "react"
import { Exam, Task } from "../types"
import { Badge, Button, ListGroup } from "react-bootstrap"
import ModalWrapper from "../../../components/modal-wrapper/ModalWrapper"
import Form from "react-bootstrap/Form"
import ConfirmButton from "../../../components/confirm-button/ConfirmButton"
import { useDeleteTask, useUpdateExam } from "../api"
import { FieldValues, useForm } from "react-hook-form"
import { useFetchSchoolClasses } from "../../school_classes/api"

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
  const [editDeactivated, toggleEditDeactivated] = useReducer((prevState) => !prevState, false)
  const [deactivatedFor, setDeactivatedFor] = useState(task.deactivated_for)

  const { register, handleSubmit, reset } = useForm()
  const { mutate: updateExam } = useUpdateExam()
  const { mutate: deleteTask } = useDeleteTask(exam, task)
  const { data: schoolClasses } = useFetchSchoolClasses()

  useEffect(() => {
    setDeactivatedFor(task.deactivated_for)
  }, [task, edit])

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const close = () => setEdit(false)
  const open = () => setEdit(true)

  /**
   * Add SchoolClass ID to the list of deactivated
   * @param schoolClassId
   */
  const deactivate = (schoolClassId: string) => {
    return () => setDeactivatedFor(deactivatedFor ? [...deactivatedFor, schoolClassId] : [schoolClassId])
  }

  const removeFromDeactivatedList = (schoolClassId: string) => {
    return () => {
      if (editDeactivated) setDeactivatedFor(deactivatedFor?.filter((sc_id) => sc_id !== schoolClassId))
    }
  }

  const handleDelete = () => {
    deleteTask(undefined, {
      onSuccess: () => close(),
    })
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
                deactivated_for: deactivatedFor,
              }
            : t
        ),
      },
      {
        onSuccess: () => {
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
          {!!deactivatedFor?.length && (
            <div>
              <i className="bi bi-slash-circle" />{" "}
              {deactivatedFor.map((d) => (
                <span key={task._id + d}>{d}</span>
              ))}
            </div>
          )}
        </div>
      </ListGroup.Item>
      <ModalWrapper options={{ size: "lg" }} show={edit} close={close} title={`${task.name} bearbeiten`}>
        <Form onSubmit={handleSubmit((values) => performUpdate(values))}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control {...register("name")} type="text" placeholder="Name" defaultValue={task.name} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Erreichbare Punktzahl</Form.Label>
            <Form.Control {...register("max_points")} type="number" step="0.1" defaultValue={task.max_points} />
          </Form.Group>
          <div className="mb-2">
            In der Bewertung ignorieren für die Klassen{" "}
            <Button size="sm" onClick={toggleEditDeactivated}>
              <i className="bi bi-pencil" />
            </Button>
          </div>
          <div className="border rounded p-2 mb-3">
            {deactivatedFor?.map((d) => (
              <Badge pill key={task._id + d} className="cursor-pointer me-1" onClick={removeFromDeactivatedList(d)}>
                {d}
              </Badge>
            ))}
            {editDeactivated && (
              <>
                <hr />
                <div>
                  {schoolClasses
                    ?.filter(({ _id }) => !deactivatedFor?.includes(_id))
                    .map((schoolClass) => (
                      <Badge
                        pill
                        className="cursor-pointer me-1"
                        key={schoolClass._id + "deact"}
                        onClick={deactivate(schoolClass._id)}
                      >
                        Bei {schoolClass.name} ignorieren
                      </Badge>
                    ))}
                </div>
              </>
            )}
          </div>
          <Button variant="primary" type="submit" className="me-2">
            Speichern
          </Button>
          <ConfirmButton
            onSuccess={handleDelete}
            question={`${task.name} löschen?`}
            description={`${task.name} wird auch aus der Bewertung entfernt`}
          >
            Aufgabe Löschen
          </ConfirmButton>
        </Form>
      </ModalWrapper>
    </>
  )
}

export default TaskItem
