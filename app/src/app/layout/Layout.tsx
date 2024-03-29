import React, { createContext, FunctionComponent, useState } from "react"
import { Outlet } from "react-router-dom"
import SideBar from "../sidebar/SideBar"

type LayoutProps = {}

interface LayoutContextType {
  sideBarCollapsed: boolean
  toggleSideBar: VoidFunction
}

const LayoutContext = createContext<LayoutContextType>(null!)

export const useLayout = () => React.useContext(LayoutContext)

const Layout: FunctionComponent<LayoutProps> = () => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [sideBarCollapsed, setCollapsed] = useState<boolean>(false)

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/
  const toggleSideBar = () => setCollapsed(!sideBarCollapsed)

  return (
    <LayoutContext.Provider value={{ sideBarCollapsed, toggleSideBar }}>
      <div className="vh-100 d-flex">
        <div>
          <SideBar />
        </div>
        <div className="w-100 container">
          <Outlet />
        </div>
      </div>
    </LayoutContext.Provider>
  )
}

export default Layout
