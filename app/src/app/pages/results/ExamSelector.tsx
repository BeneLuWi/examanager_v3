import React, { Dispatch, FunctionComponent, SetStateAction, useCallback, useEffect, useState } from "react"
import { Exam } from "../exams/types"
import axios from "axios"
import { toast } from "react-toastify"
import { ListGroup } from "react-bootstrap"
import { useResultContext } from "./Results"
import { useFetchExams } from "../exams/api"

type ExamSelectorProps = {
  setExam: Dispatch<SetStateAction<Exam | undefined>>
}

const ExamSelector: FunctionComponent<ExamSelectorProps> = ({ setExam }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/
  const { data: exams } = useFetchExams()

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
      <ListGroup>
        {exams?.map((exam) => (
          <ListGroup.Item key={exam._id} action onClick={() => setExam(exam)}>
            <div>
              <div className="fw-bold">{exam.name}</div>
              {exam.description}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default ExamSelector
