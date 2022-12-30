import React, { FunctionComponent } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "react-bootstrap"
import { useFetchStatistics } from "../api"
import { useStatisticsContext } from "../Statistics"
import { ExaColors } from "../../../components/colors/colors"
import { graphPresets } from "./presets"
import CustomTooltip from "./CustomTooltip"

type AverageGradeProps = {}

const MeanPoints: FunctionComponent<AverageGradeProps> = ({}) => {
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
        <Card.Title>Erreichte Punkte {statistics?.mean.name}</Card.Title>
        <div style={{ height: graphPresets.height }}>
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
                <YAxis interval={0} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                <Tooltip content={CustomTooltip} />
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

export default MeanPoints
