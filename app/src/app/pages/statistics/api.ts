import { useQuery } from "react-query"
import axios from "axios"
import { toast } from "react-toastify"
import { ExamStatistics } from "./types"
import { parseFilterArgs } from "react-query/types/core/utils"
import { saveAs } from "file-saver"

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

export const downloadStatistics = (schoolClassId: string, examId: string) => {
  axios
    .get("/api/create_statistics_excel", {
      params: { school_class_id: schoolClassId, exam_id: examId },
      responseType: "blob",
    })
    .then((res) => {
      saveAs(res.data, "Klausurergebnisse.xlsx")
    })
    .catch(() => toast("Fehler beim Download", { type: "error" }))
}
