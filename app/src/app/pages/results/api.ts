import { useMutation, useQuery, useQueryClient } from "react-query"
import axios from "axios"
import { CreateResultRequest, ExamResultsResponse } from "./types"
import { toast } from "react-toastify"

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
    },
  })
}
