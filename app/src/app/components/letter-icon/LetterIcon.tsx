import React, { CSSProperties, FunctionComponent, useState } from "react"

type LetterIconProps = {
  name: string
  id: string
  style?: CSSProperties
  rounded?: boolean
}

const colorClasses = [
  "bg-exa-dark",
  "bg-exa-bright",
  "bg-exa-orange",
  "bg-exa-red",
  "bg-exa-green",
  "bg-exa-purple",
  "bg-exa-kaki",
  "bg-exa-blue2",
  "bg-exa-brown",
  "bg-exa-rost",
]

const createIdHash = (id: string) => {
  id = id.replace(/\D/g, "")
  return parseInt(id.slice(-1))
}

const LetterIcon: FunctionComponent<LetterIconProps> = ({ name, id, style, rounded }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [idHash] = useState(createIdHash(id))

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const size = "3rem"

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <div
      className={`${rounded ? "rounded" : "rounded-circle"} text-center align-middle me-2 ${colorClasses[idHash]}`}
      style={{ width: size, height: size, lineHeight: size, ...style }}
    >
      <span className="fw-bolder fs-5">{name.substring(0, 1)}</span>
    </div>
  )
}

export default LetterIcon
