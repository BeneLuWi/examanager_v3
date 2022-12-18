import { useQuery } from "react-query"
import axios from "axios"
import { ExamResultsResponse } from "./types"

export const useFetchResults = (schoolClassId?: string, examId?: string) =>
  useQuery<ExamResultsResponse, Error>(
    ["results", schoolClassId, examId],
    () => axios.get(`api/result/${examId}/${schoolClassId}`).then((res) => res.data),
    {
      enabled: !!schoolClassId && !!examId,
    }
  )
