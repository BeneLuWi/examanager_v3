import React, { Dispatch, FunctionComponent, SetStateAction, useCallback, useEffect, useState } from "react"
import { Exam } from "../exams/types"
import axios from "axios"
import { toast } from "react-toastify"
import { Card, ListGroup } from "react-bootstrap"
import { useResultContext } from "./StudentResultList"
import { useFetchExams } from "../exams/api"
import ListGroupCard from "../../components/list-group-card/ListGroupCard"
import LetterIcon from "../../components/letter-icon/LetterIcon"

type ExamSelectorProps = {}

const ExamSelector: FunctionComponent<ExamSelectorProps> = () => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/
  const { data: exams } = useFetchExams()
  const { setExam } = useResultContext()
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
    <div>
      <ListGroupCard>
        <Card.Title>
          <i className="bi bi-list-check" /> Meine Klausuren
        </Card.Title>
        {exams?.map((exam) => (
          <ListGroup.Item key={exam._id} action onClick={() => setExam(exam)} className="d-flex">
            <LetterIcon name={exam.name} id={exam._id} />
            <div>
              <div className="fw-bold">{exam.name}</div>
              {exam.description}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroupCard>
    </div>
  )
}

export default ExamSelector
