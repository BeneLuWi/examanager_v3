import React, { FunctionComponent } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { exampleAverage } from "../types"
import { Card } from "react-bootstrap"

type AverageGradeProps = {}

const AverageGrade: FunctionComponent<AverageGradeProps> = ({}) => {
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
    <Card>
      <Card.Body>
        <Card.Title>Durchschnittliche MSS-Punkte</Card.Title>
        <div style={{ height: 200 }}>
          <ResponsiveContainer>
            <BarChart
              margin={{
                top: 10,
                right: 10,
                left: 10,
              }}
              data={exampleAverage}
            >
              <YAxis domain={[0, 15]} tickCount={15} interval={0} />
              <XAxis dataKey="type" />
              <Tooltip />
              <Bar animationBegin={700} dataKey="mss_points" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  )
}

export default AverageGrade
