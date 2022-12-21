import React, { FunctionComponent, useState } from "react"
import { Rating } from "../types"
import { Button, Col, Form, InputGroup, ListGroup, Row } from "react-bootstrap"
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
  const [percentage, setPercentage] = useState<number>(round(rating.percentage))

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/
  const close = () => setEdit(false)
  const open = () => setEdit(true)

  const handleSubmit = () => {
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

      <ModalWrapper
        title={`Voraussetzungen für ${rating.mss_points} MSS-Punkte`}
        options={{ size: "sm" }}
        show={edit}
        close={close}
      >
        <Row>
          <Col xs={6}>
            <label>Prozentgrenze</label>
            <InputGroup>
              <Form.Control
                onChange={(e) => setPercentage(parseInt(e.target.value))}
                name="percentage"
                type="number"
                min={0}
                max={100}
                value={percentage}
              />
              <Form.Label className="fw-bold pt-1">%</Form.Label>
            </InputGroup>
          </Col>
          <Col>
            <div>Punktegrenze</div>
            <div className="fw-bold p-1">{Math.round((percentage / 100) * totalPoints)}</div>
          </Col>
        </Row>
        <hr />
        <Button onClick={handleSubmit} variant="primary" disabled={!percentage} className="me-2">
          Speichern
        </Button>
      </ModalWrapper>
    </>
  )
}

export default RatingItem
