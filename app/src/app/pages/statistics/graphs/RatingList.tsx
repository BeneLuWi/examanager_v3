import React, { FunctionComponent } from "react"
import { Rating } from "../../exams/types"
import { ListGroup } from "react-bootstrap"

type RatingListProps = {
  ratings: Rating[]
}

const RatingList: FunctionComponent<RatingListProps> = ({ ratings }) => {
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
      {ratings.map((rating) => (
        <ListGroup.Item key={rating.school_rating}>
          {rating.mss_points} MSS-Punkte ab {Math.round(rating.percentage * 100)}%
        </ListGroup.Item>
      ))}
    </>
  )
}

export default RatingList
