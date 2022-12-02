import React, { FunctionComponent, useCallback } from "react"
import { Exam } from "../types"
import { Card } from "react-bootstrap"
import RatingItem from "./RatingItem"

type RatingListProps = {
  exam: Exam
}

const RatingList: FunctionComponent<RatingListProps> = ({ exam }) => {
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

  const totalPoints = useCallback(() => {
    return exam.tasks.reduce((a, b) => a + b.max_points, 0)
  }, [exam])

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <Card>
      <Card.Body>
        <Card.Title>Bewertung</Card.Title>
        {exam.ratings.map((rating) => (
          <RatingItem rating={rating} totalPoints={totalPoints()} />
        ))}
      </Card.Body>
    </Card>
  )
}

export default RatingList
