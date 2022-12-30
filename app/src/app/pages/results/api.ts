import { useMutation, useQuery, useQueryClient } from "react-query"
import axios from "axios"
import { CreateResultRequest, ExamResultsResponse, StudentResult } from "./types"
import { toast } from "react-toastify"
import { Exam } from "../exams/types"
import { SchoolClass, Student } from "../school_classes/types"

export const useFetchResults = (schoolClassId?: string, examId?: string) =>
  useQuery<ExamResultsResponse, Error>(
    ["results", schoolClassId, examId],
    () => axios.get(`api/result/${examId}/${schoolClassId}`).then((res) => res.data),
    {
      enabled: !!schoolClassId && !!examId,
      onError: () => toast("Fehler beim Laden der Ergebnisse", { type: "error" }),
    }
  )

export const useCreateResult = () => {
  const queryClient = useQueryClient()

  return useMutation((createResultRequest: CreateResultRequest) => axios.post("api/result", createResultRequest), {
    onSuccess: () => {
      queryClient.invalidateQueries("results")
      queryClient.invalidateQueries("statistics")
    },
  })
}

export const useDeleteResult = (exam: Exam, student: Student) => {
  const queryClient = useQueryClient()

  return useMutation(
    () =>
      axios.delete("api/result", {
        params: {
          exam_id: exam._id,
          student_id: student._id,
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("results")
        queryClient.invalidateQueries("statistics")
      },
    }
  )
}

export const useFetchExamResultList = (examId: string) =>
  useQuery<SchoolClass[], Error>(["result", examId], () => axios.get(`api/result/${examId}`).then((res) => res.data), {
    onError: () => toast("Fehler beim Laden der Ergebnisse", { type: "error" }),
  })
