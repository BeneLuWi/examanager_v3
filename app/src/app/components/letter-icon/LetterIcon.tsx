import React, { CSSProperties, FunctionComponent, useState } from "react"

type LetterIconProps = {
  name: string
  id: string
  style?: CSSProperties
  rounded?: boolean

  size?: string
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
  // Weird overlapping
  // TODO find good way of semi randomness
  return parseInt(id.slice(6, 7))
}

const LetterIcon: FunctionComponent<LetterIconProps> = ({ name, id, style, rounded, size = "3rem" }) => {
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
