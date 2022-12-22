import React, { FunctionComponent, useState } from "react"

type LetterIconProps = {
  name: string
  id: string
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

const LetterIcon: FunctionComponent<LetterIconProps> = ({ name, id }) => {
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
      className={`rounded-circle text-center align-middle me-2 ${colorClasses[idHash]}`}
      style={{ width: size, height: size, lineHeight: size }}
    >
      <span className="fw-bolder fs-5">{name.substring(0, 1)}</span>
    </div>
  )
}

export default LetterIcon
