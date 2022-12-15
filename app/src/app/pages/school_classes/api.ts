import { useMutation, useQuery, useQueryClient } from "react-query"
import { SchoolClass, Student } from "./types"
import axios from "axios"
import { toast } from "react-toastify"

export const useFetchSchoolClasses = () =>
  useQuery<SchoolClass[], Error>("schoolClasses", () => axios.get("api/school_class").then((res) => res.data), {
    onError: () => toast("Fehler beim Laden Klassen", { type: "error" }),
  })

export const useUpdateSchoolClass = () => {
  const queryClient = useQueryClient()
  return useMutation((schoolClass: SchoolClass) => axios.put("api/school_class", schoolClass), {
    onSuccess: () => {
      queryClient.invalidateQueries("schoolClasses")
      queryClient.invalidateQueries("results")
    },
  })
}

export const useDeleteSchoolClass = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (schoolClass: SchoolClass) => axios.delete("api/school_class", { params: { school_class_id: schoolClass._id } }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("schoolClasses")
        queryClient.invalidateQueries("results")
      },
    }
  )
}

export const useCreateSchoolClass = () => {
  const queryClient = useQueryClient()
  return useMutation((schoolClass: SchoolClass) => axios.post("api/school_class"), {
    onSuccess: () => {
      queryClient.invalidateQueries("schoolClasses")
      queryClient.invalidateQueries("results")
    },
  })
}

export const useFetchStudents = (schoolClass: SchoolClass) =>
  useQuery<Student[], Error>(
    ["students", schoolClass],
    () => axios.get(`/api/student/${schoolClass._id}`).then((res) => res.data),
    {
      onError: () => toast("Fehler beim Laden Schüler:innen", { type: "error" }),
    }
  )

export const useCreateStudent = (schoolClass: SchoolClass) => {
  const queryClient = useQueryClient()
  return useMutation(
    (student: Student) =>
      axios.post("api/student", {
        ...student,
        school_class_id: schoolClass._id,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("students")
        queryClient.invalidateQueries("results")
      },
      onError: () => {
        toast("Fehler beim erstellen", { type: "error" })
      },
    }
  )
}
