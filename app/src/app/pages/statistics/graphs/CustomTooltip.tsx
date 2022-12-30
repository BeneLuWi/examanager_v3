import React, { FunctionComponent } from "react"
import { TooltipProps } from "recharts"
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import { Card } from "react-bootstrap"

const dataKey2name = (key: string | number | undefined): string => {
  switch (key) {
    case "value_total":
      return "Gesamt"
    case "value_d":
      return "Divers"
    case "value_w":
      return "Weiblich"
    case "value_m":
      return "Männlich"
    default:
      return ""
  }
}

const CustomTooltip: FunctionComponent<TooltipProps<ValueType, NameType>> = ({ active, payload, label }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

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
  if (active && payload && payload.length) {
    return (
      <Card>
        <Card.Body>
          <Card.Title>{label}</Card.Title>
          {payload.map((data) => (
            <p key={data.name} style={{ color: data.color }}>
              {dataKey2name(data.dataKey)}: {data.value}
            </p>
          ))}
        </Card.Body>
      </Card>
    )
  }

  return null
}

export default CustomTooltip
