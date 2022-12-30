import { useQuery } from "react-query"
import axios from "axios"
import { toast } from "react-toastify"
import { ExamStatistics } from "./types"

export const useFetchStatistics = (schoolClassId?: string, examId?: string) =>
  useQuery<ExamStatistics, Error>(
    ["statistics", schoolClassId, examId],
    () =>
      axios
        .get("api/calculate_statistics", {
          params: {
            exam_id: examId,
            school_class_id: schoolClassId,
          },
        })
        .then((res) => res.data),
    {
      enabled: !!schoolClassId && !!examId,
      onError: () => toast("Fehler beim Laden der Statistiken", { type: "error" }),
    }
  )
