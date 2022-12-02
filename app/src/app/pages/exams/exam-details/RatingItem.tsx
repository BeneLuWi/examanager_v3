import React, { FunctionComponent, useState } from "react"
import { Rating } from "../types"
import { Button, Form, ListGroup } from "react-bootstrap"
import ModalWrapper from "../../../components/modal-wrapper/ModalWrapper"

type RatingItemProps = {
  rating: Rating
  totalPoints: number
  updateRating: (ratingUpdate: Rating) => void
}

const round = (percentage: number): number => Math.round(percentage * 100)

const RatingItem: FunctionComponent<RatingItemProps> = ({ rating, totalPoints, updateRating }) => {
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    let formData = new FormData(event.currentTarget)
    const percentage = formData.get("percentage") as unknown as number

    const ratingUpdate: Rating = {
      ...rating,
      percentage: percentage / 100,
    }

    updateRating(ratingUpdate)
    close()
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
          <span className="fw-bold">
            {rating.mss_points} MSS-Punkte ab {round(rating.percentage)}%
          </span>
          <span> ({Math.round(rating.percentage * totalPoints)} Punkte)</span>
        </div>
        <div>
          {rating.text_rating} | {rating.decimal_rating} | {rating.school_rating}
        </div>
      </ListGroup.Item>

      <ModalWrapper title={`Voraussetzungen für ${rating.mss_points} MSS-Punkte`} size="sm" show={edit} close={close}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Prozent der erreichten Punkte</Form.Label>
            <Form.Control name="percentage" type="number" placeholder="" defaultValue={round(rating.percentage)} />
          </Form.Group>
          <Button variant="primary" type="submit" className="me-2">
            Speichern
          </Button>
        </Form>
      </ModalWrapper>
    </>
  )
}

export default RatingItem
