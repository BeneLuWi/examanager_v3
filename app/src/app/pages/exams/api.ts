import axios from "axios"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { Exam } from "./types"

// Get QueryClient from the context

export const useFetchExams = () => useQuery<Exam[], Error>("exams", () => axios.get("api/exam").then((res) => res.data))
