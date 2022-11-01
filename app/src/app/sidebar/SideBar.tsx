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
      <div className="d-flex align-items-center">
        <img
          src={process.env.PUBLIC_URL + "/logo192.png"}
          className={c({ "d-block ms-auto me-auto": sideBarCollapsed, "me-1": !sideBarCollapsed })}
          alt="Project Logo"
          style={{ width: 40 }}
        />
        {!sideBarCollapsed && <span className="fs-3 text-nowrap">Boilerplate</span>}
      </div>

      <hr />
      <Nav variant="pills" className="flex-column">
        <NavItem title="Home" icon="bi bi-house" path="/" />
        <NavItem title="User Profile" icon="bi bi-person-square" path="/userprofile" />
        <NavItem title="Dashboard" icon="bi bi-grid-3x3-gap" path="/dashboard" />
        {auth.auth?.role === Roles.ADMIN ? (
          <NavItem title="Admin Panel" icon="bi bi-person" path="/adminpanel" />
        ) : (
          <></>
        )}

        <NavItem title="Examples" icon="bi bi-info-circle" path="/examples" hasSubRoute={true} />
        <hr />
        <Nav.Link onClick={() => auth.signOut(() => navigate("/"))}>
          <span>
            <i className="bi bi-box-arrow-left" /> {!sideBarCollapsed && "Logout"}
          </span>
        </Nav.Link>
      </Nav>

      <div className="d-flex align-items-start flex-column mt-auto">
        {!sideBarCollapsed && (
          <div className="m-2">
            <img src={process.env.PUBLIC_URL + "/dfki_logo.svg"} alt="DFKI-Logo" style={{ maxWidth: 200 }} />
          </div>
        )}

        <Button className="m-2" onClick={toggleSideBar}>
          {sideBarCollapsed ? (
            <i className="bi bi-chevron-double-right" />
          ) : (
            <span className="d-flex justify-content-around" style={{ width: 180 }}>
              <i className="bi bi-chevron-double-left" />
              <span>collapse sidebar</span>
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}

export default SideBar
