import React, { FunctionComponent } from "react"
import { Exam } from "../../exams/types"
import { Card, ListGroup } from "react-bootstrap"
import LetterIcon from "../../../components/letter-icon/LetterIcon"
import { useFetchExamResultList } from "../../results/api"
import { useStatisticsContext } from "../Statistics"

type SelectorItemProps = { exam: Exam }

const SelectorItem: FunctionComponent<SelectorItemProps> = ({ exam }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { data: schoolClasses } = useFetchExamResultList(exam._id)
  const { setExam, setSchoolClass } = useStatisticsContext()
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
          <div>{exam.name}</div>
        </Card.Title>
        <div className="small">{exam.description}</div>
        <hr />
        <p>Klassen mit Ergebnissen</p>
        <ListGroup>
          {schoolClasses?.map((schoolClass) => (
            <ListGroup.Item
              key={schoolClass._id}
              action
              className="d-flex align-items-center"
              onClick={() => {
                setSchoolClass(schoolClass)
                setExam(exam)
              }}
            >
              <LetterIcon name={schoolClass.name} id={schoolClass._id} rounded size="2rem" />
              <div>{schoolClass.name}</div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

export default SelectorItem
