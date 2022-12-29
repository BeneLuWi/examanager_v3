import React, { FunctionComponent } from "react"
import { Nav } from "react-bootstrap"
import NavItem from "./NavItem"
import { useAuth } from "../auth"
import { useNavigate } from "react-router-dom"
import { Roles } from "../auth/types"

type SideBarProps = {}

const SideBar: FunctionComponent<SideBarProps> = () => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/
  const auth = useAuth()
  const navigate = useNavigate()

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
    <div className="d-flex flex-column p-3 vh-100 shadow text-nowrap overflow-hidden w-100 bg-white">
      <div className="d-flex align-items-center flex-column">
        <img src={process.env.PUBLIC_URL + "/logo.png"} alt="Project Logo" style={{ width: 150 }} />
      </div>

      <hr />
      <Nav variant="pills" className="flex-column">
        <NavItem title="Home" icon="bi bi-house" path="/" />
        <NavItem title="Klassen" icon="bi bi-people" path="/classes" />
        <NavItem title="Klausuren" icon="bi bi-list" path="/exams" />
        <NavItem title="Statistiken" icon="bi bi-bar-chart" path="/statistics" />
        {auth.auth?.role === Roles.ADMIN ? <NavItem title="Admin" icon="bi bi-clipboard-check" path="/admin" /> : <></>}
        <hr />
        <Nav.Link onClick={() => auth.signOut(() => navigate("/"))}>
          <span>
            <i className="bi bi-box-arrow-left" /> Logout
          </span>
        </Nav.Link>
      </Nav>
    </div>
  )
}

export default SideBar
