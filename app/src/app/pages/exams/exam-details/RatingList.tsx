import React, { FunctionComponent, useCallback } from "react"
import { Exam, Rating } from "../types"
import { Card } from "react-bootstrap"
import RatingItem from "./RatingItem"
import { useUpdateExam } from "../api"

type RatingListProps = {
  exam: Exam
}

const RatingList: FunctionComponent<RatingListProps> = ({ exam }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { mutate: updateExam } = useUpdateExam()

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const updateRating = (ratingUpdate: Rating) => {
    const examUpdated: Exam = {
      ...exam,
      ratings: exam.ratings.map((rating) => {
        if (rating.mss_points === ratingUpdate.mss_points) return ratingUpdate
        else return rating
      }),
    }
    updateExam(examUpdated)
  }

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
          <RatingItem
            key={rating.school_rating}
            rating={rating}
            totalPoints={totalPoints()}
            updateRating={updateRating}
          />
        ))}
      </Card.Body>
    </Card>
  )
}

export default RatingList
