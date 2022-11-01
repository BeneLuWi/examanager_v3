import React, { FunctionComponent } from "react"
import { Nav } from "react-bootstrap"
import NavItem from "./NavItem"
import { Button } from "react-bootstrap"
import { default as c } from "classnames"
import { useAuth } from "../auth"
import { useNavigate } from "react-router-dom"
import { Roles } from "../auth/types"
import { useLayout } from "../layout/Layout"

type SideBarProps = {}

const SideBar: FunctionComponent<SideBarProps> = () => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/
  const auth = useAuth()
  const navigate = useNavigate()
  const { sideBarCollapsed, toggleSideBar } = useLayout()

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
    <div className="d-flex flex-column p-3 vh-100 shadow text-nowrap overflow-hidden w-100">
      <div className="d-flex align-items-center flex-column">
        <img src={process.env.PUBLIC_URL + "/logo.png"} alt="Project Logo" style={{ width: 150 }} />
      </div>

      <hr />
      <Nav variant="pills" className="flex-column">
        <NavItem title="Home" icon="bi bi-house" path="/" />
        <NavItem title="Klassen" icon="bi bi-grid-3x3-gap" path="/classes" />
        <NavItem title="Schüler:innen" icon="bi bi-grid-3x3-gap" path="/students" />
        <NavItem title="Klausuren" icon="bi bi-grid-3x3-gap" path="/exams" />
        <NavItem title="Ergebnisse" icon="bi bi-grid-3x3-gap" path="/results" />
        <NavItem title="Statistiken" icon="bi bi-grid-3x3-gap" path="/statistics" />
        {auth.auth?.role === Roles.ADMIN ? <NavItem title="Admin" icon="bi bi-person" path="/admin" /> : <></>}
        <hr />
        <Nav.Link onClick={() => auth.signOut(() => navigate("/"))}>
          <span>
            <i className="bi bi-box-arrow-left" /> {!sideBarCollapsed && "Logout"}
          </span>
        </Nav.Link>
      </Nav>
    </div>
  )
}

export default SideBar
