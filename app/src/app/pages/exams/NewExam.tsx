import React, { FunctionComponent } from "react"
import { Button, Card } from "react-bootstrap"
import Form from "react-bootstrap/Form"
import axios from "axios"
import { toast } from "react-toastify"
import { useMutation, useQueryClient } from "react-query"
import { FieldValues, useForm } from "react-hook-form"

type NewExamProps = {}

const NewExam: FunctionComponent<NewExamProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm()

  const { mutate: createExam } = useMutation(
    (values: FieldValues) => {
      return axios.post("api/exam", {
        ...values,
        tasks: [],
      })
    },
    {
      onSuccess: () => {
        reset()
        queryClient.invalidateQueries("exams")
        queryClient.invalidateQueries("results")
      },
      onError: () => {
        toast("Fehler beim Erstellen", { type: "error" })
      },
    }
  )

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
          <i className="bi bi-file-earmark-plus" /> Klausur hinzufügen
        </Card.Title>
        <Form onSubmit={handleSubmit((values) => createExam(values))}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control {...register("name")} type="text" placeholder="" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control {...register("description")} type="text" placeholder="(optional)" />
          </Form.Group>
          <Button variant="success" type="submit">
            Erstellen
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default NewExam
