import axios from "axios"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { Exam } from "./types"
import { toast } from "react-toastify"

export const useFetchExams = () => useQuery<Exam[], Error>("exams", () => axios.get("api/exam").then((res) => res.data))

export const useUpdateExam = () => {
  const queryClient = useQueryClient()
  return useMutation((exam: Exam) => axios.put("api/exam", exam), {
    onSuccess: () => {
      queryClient.invalidateQueries("exams")
      queryClient.invalidateQueries("results")
    },
    onError: () => {
      toast("Fehler beim Bearbeiten", { type: "error" })
    },
  })
}
