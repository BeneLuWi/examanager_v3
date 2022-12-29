import React, { FunctionComponent, useState } from "react"
import { SchoolClass, Student } from "../types"
import { Button, Card } from "react-bootstrap"
import ModalWrapper from "../../../components/modal-wrapper/ModalWrapper"
import Form from "react-bootstrap/Form"
import ConfirmButton from "../../../components/confirm-button/ConfirmButton"
import { useDeleteSchoolClass, useUpdateSchoolClass } from "../api"
import { FieldValues, useForm } from "react-hook-form"
import SchoolClassComposition from "../../statistics/graphs/SchoolClassComposition"

type SchoolClassDetailsProps = {
  schoolClass: SchoolClass
  students?: Student[]
}

const SchoolClassDetails: FunctionComponent<SchoolClassDetailsProps> = ({ schoolClass, students }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [show, setShow] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const { mutate: deleteSchoolClass } = useDeleteSchoolClass()
  const { mutate: updateSchoolClass } = useUpdateSchoolClass()

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/
  const open = () => setShow(true)
  const close = () => setShow(false)

  const performUpdate = (values: FieldValues) => {
    updateSchoolClass(
      {
        ...schoolClass,
        ...values,
      },
      {
        onSuccess: () => {
          close()
          reset()
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
      <Card>
        <Card.Body>
          <Card.Title>
            <i className="bi bi-info-circle" /> Infos
          </Card.Title>
          <p>Name: {schoolClass.name}</p>
          <p>Beschreibung: {schoolClass.description}</p>
          <p>Anzahl der Schüler:innen: {students?.length}</p>
          <div style={{ height: 200 }}>{students && <SchoolClassComposition students={students} />}</div>

          <Button onClick={open}>Bearbeiten</Button>
        </Card.Body>
      </Card>

      <ModalWrapper options={{ size: "lg" }} show={show} close={close} title={`${schoolClass.name} bearbeiten`}>
        <Form onSubmit={handleSubmit((values) => performUpdate(values))}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control {...register("name")} type="text" placeholder="Name" defaultValue={schoolClass.name} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Beschreibung</Form.Label>
            <Form.Control
              {...register("description")}
              type="text"
              placeholder="Beschreibung (optional)"
              defaultValue={schoolClass.description}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="me-3">
            Speichern
          </Button>
          <ConfirmButton onSuccess={() => deleteSchoolClass(schoolClass)} question={`${schoolClass.name} löschen?`}>
            Klasse Löschen
          </ConfirmButton>
        </Form>
      </ModalWrapper>
    </>
  )
}

export default SchoolClassDetails
