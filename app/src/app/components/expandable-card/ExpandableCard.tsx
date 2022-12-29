import React, { FunctionComponent, PropsWithChildren, useReducer } from "react"
import { Card } from "react-bootstrap"
import { Spring, a } from "@react-spring/web"

type ExpandableCardProps = {
  title: string
}

const ExpandableCard: FunctionComponent<PropsWithChildren<ExpandableCardProps>> = ({ children, title }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [expanded, toggleExpanded] = useReducer((state) => !state, false)

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
        <Card.Title onClick={toggleExpanded}>
          {title} <i className={`bi ${expanded ? "bi-caret-down-fill" : "bi-caret-up-fill"}`} />{" "}
        </Card.Title>
        <Spring from={{ maxHeight: 0 }} to={{ maxHeight: expanded ? 400 : 0 }}>
          {(styles) => <a.div style={{ ...styles, overflowY: "scroll" }}>{children}</a.div>}
        </Spring>
      </Card.Body>
    </Card>
  )
}

export default ExpandableCard
