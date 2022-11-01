import React, { FunctionComponent } from "react"
import { Nav } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"
import { default as c } from "classnames"
import { useLayout } from "../layout/Layout"

type NavItemProps = {
  title: string
  icon: string
  path: string
  hasSubRoute?: boolean
}

const NavItem: FunctionComponent<NavItemProps> = ({ title, icon, path, hasSubRoute }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { pathname } = useLocation()
  const { sideBarCollapsed } = useLayout()
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

  const active = hasSubRoute ? pathname.includes(path) : pathname === path

  return (
    <Nav.Item>
      <Link className={c("nav-link", { active: active })} to={path}>
        <span>
          <i className={icon} /> {title}
        </span>
      </Link>
    </Nav.Item>
  )
}

export default NavItem
