import React, { FunctionComponent } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "react-bootstrap"
import { useFetchStatistics } from "../api"
import { useStatisticsContext } from "../Statistics"
import { ExaColors } from "../../../components/colors/colors"

type AverageGradeProps = {}

const AverageGrade: FunctionComponent<AverageGradeProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const { exam, schoolClass } = useStatisticsContext()
  const { data: statistics } = useFetchStatistics(schoolClass?._id, exam?._id)

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <Card>
      <Card.Body>
        <Card.Title>{statistics?.mean.name}</Card.Title>
        <div style={{ height: 200 }}>
          {statistics ? (
            <ResponsiveContainer>
              <BarChart
                data={statistics.mean.statistics}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                }}
              >
                <YAxis domain={[0, 15]} tickCount={15} interval={0} />
                <XAxis dataKey="name" />
                <Tooltip />
                <Bar animationBegin={700} dataKey="value_total" fill={ExaColors.bright} />
                <Bar animationBegin={700} dataKey="value_m" fill={ExaColors.green} />
                <Bar animationBegin={700} dataKey="value_w" fill={ExaColors.brown} />
                <Bar animationBegin={700} dataKey="value_d" fill={ExaColors.kaki} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div>Loading</div>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default AverageGrade
