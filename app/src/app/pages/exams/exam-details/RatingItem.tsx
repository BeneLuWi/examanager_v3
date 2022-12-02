import React, { FunctionComponent } from "react"
import { Exam, Rating } from "../types"
import { ListGroup } from "react-bootstrap"

type RatingItemProps = {
  rating: Rating
  totalPoints: number
}

const round = (percentage: number): number => Math.round(percentage * 100)

const RatingItem: FunctionComponent<RatingItemProps> = ({ rating, totalPoints }) => {
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
    <>
      <ListGroup.Item action>
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
    </>
  )
}

export default RatingItem
