import React, { FunctionComponent } from "react"
import { Exam } from "../../exams/types"
import { Card } from "react-bootstrap"
import LetterIcon from "../../../components/letter-icon/LetterIcon"
import { useFetchExamResultList } from "../../results/api"

type SelectorItemProps = { exam: Exam }

const SelectorItem: FunctionComponent<SelectorItemProps> = ({ exam }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { data: schoolClasses } = useFetchExamResultList(exam._id)

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
    <Card style={{ width: "15rem" }}>
      <Card.Body>
        <LetterIcon
          name={exam.name}
          id={exam._id}
          style={{ position: "absolute", transform: "translate(-3rem,-1.5rem)" }}
        />
        <Card.Title>
          <div className="d-flex align-items-center">{exam.name}</div>
        </Card.Title>
        <p>
          {schoolClasses?.map((schoolClass) => (
            <div>{schoolClass.name}</div>
          ))}
        </p>
      </Card.Body>
    </Card>
  )
}

export default SelectorItem
