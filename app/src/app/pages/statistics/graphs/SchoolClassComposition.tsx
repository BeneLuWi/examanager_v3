import React, { FunctionComponent, useMemo } from "react"
import { Gender, Student } from "../../school_classes/types"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

type SchoolClassCompositionProps = {
  students: Student[]
}

interface ClassComposition {
  amount: number
  gender: string
  color: string
}

const SchoolClassComposition: FunctionComponent<SchoolClassCompositionProps> = ({ students }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  let data: ClassComposition[]

  let numM = 0,
    numW = 0,
    numD = 0
  for (const student of students) {
    switch (student.gender) {
      case Gender.d:
        numD++
        break
      case Gender.m:
        numM++
        break
      default:
        numW++
        break
    }
  }
  data = [
    {
      gender: "Männlich",
      amount: numM,
      color: "#77A33E",
    },
    {
      gender: "Weiblich",
      amount: numW,
      color: "#EF9362",
    },
    {
      gender: "Divers",
      amount: numD,
      color: "#A39C3E",
    },
  ]

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
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="gender"
          cx="50%"
          cy="50%"
          outerRadius={"60%"}
          fill="blue"
          label={(datum) => `${datum.gender}: ${datum.amount}`}
        >
          {data.map((datum, index) => (
            <Cell key={`cell-${index}`} fill={datum.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export default SchoolClassComposition
