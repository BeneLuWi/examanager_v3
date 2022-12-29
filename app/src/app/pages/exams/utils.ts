import { Exam, Rating } from "./types"

export const calcGrade = (exam: Exam, sumOfPoints: number): Rating => {
  if (sumOfPoints === 0) return exam.ratings[0]

  const reachable = exam.tasks.reduce((sum, task) => sum + task.max_points, 0)
  const reachedPercentage = sumOfPoints / reachable

  let prevRating = exam.ratings[0]

  for (const rating of exam.ratings) {
    if (rating.percentage > reachedPercentage) {
      return prevRating
    }
    prevRating = rating
  }
  return exam.ratings[exam.ratings.length - 1]
}
