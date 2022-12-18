import React, { Dispatch, FunctionComponent, SetStateAction, useCallback, useEffect, useState } from "react"
import { Exam } from "../exams/types"
import axios from "axios"
import { toast } from "react-toastify"
import { ListGroup } from "react-bootstrap"
import { useResultContext } from "./Results"
import { useFetchExams } from "../exams/api"

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
