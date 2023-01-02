import axios from "axios"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { Exam, Task } from "./types"
import { toast } from "react-toastify"

export const useFetchExams = () => useQuery<Exam[], Error>("exams", () => axios.get("api/exam").then((res) => res.data))

export const useUpdateExam = () => {
  const queryClient = useQueryClient()
  return useMutation((exam: Exam) => axios.put("api/exam", exam), {
    onSuccess: () => {
      queryClient.invalidateQueries("exams")
      queryClient.invalidateQueries("results")
      queryClient.invalidateQueries("statistics")
    },
    onError: () => {
      toast("Fehler beim Bearbeiten", { type: "error" })
    },
  })
}

export const useDeleteTask = (exam: Exam, task: Task) => {
  const queryClient = useQueryClient()
  return useMutation(() => axios.delete("api/task", { params: { exam_id: exam._id, task_id: task._id } }), {
    onSuccess: () => {
      queryClient.invalidateQueries("exams")
      queryClient.invalidateQueries("results")
      queryClient.invalidateQueries("statistics")
    },
    onError: () => {
      toast("Fehler beim Löschen der Aufgabe", { type: "error" })
    },
  })
}
