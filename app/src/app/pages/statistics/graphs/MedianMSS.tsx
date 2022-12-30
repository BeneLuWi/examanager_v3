import React, { FunctionComponent } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "react-bootstrap"
import { useFetchStatistics } from "../api"
import { useStatisticsContext } from "../Statistics"
import { ExaColors } from "../../../components/colors/colors"
import { graphPresets } from "./presets"
import CustomTooltip from "./CustomTooltip"

type MedianMSSProps = {}

const MedianMSS: FunctionComponent<MedianMSSProps> = () => {
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
        <Card.Title>Note {statistics?.median_mss.name}</Card.Title>
        <div style={{ height: graphPresets.height }}>
          {statistics ? (
            <ResponsiveContainer>
              <BarChart
                data={statistics.median_mss.statistics}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                }}
              >
                <YAxis domain={[0, 15]} interval={0} tick={{ fontSize: 12 }} tickCount={16} />
                <XAxis dataKey="name" />
                <Tooltip content={CustomTooltip} />
                <Bar animationBegin={700} dataKey="value_total" fill={ExaColors.bright} />
                <Bar animationBegin={700} dataKey="value_m" fill={ExaColors.green} />
                <Bar animationBegin={700} dataKey="value_w" fill={ExaColors.red} />
                <Bar animationBegin={700} dataKey="value_d" fill={ExaColors.purple} />
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

export default MedianMSS
