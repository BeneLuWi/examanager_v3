import React, { FunctionComponent } from "react"
import { Card } from "react-bootstrap"

type LandingProps = {}

const Landing: FunctionComponent<LandingProps> = ({}) => {
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

  return (
    <div>
      <div className="page-header">Examanager</div>
      <p>
        Mit Hilfe des Examanagers können Statistiken zu Klausurergebnissen Ihrer Klassen erhoben und dargestellt werden.
      </p>
    </div>
  )
}

export default Landing
