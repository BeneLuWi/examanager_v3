import React, { FunctionComponent } from "react"
import { Route, Routes } from "react-router-dom"
import Login from "../auth/Login"
import Layout from "../layout/Layout"
import RequireAuth from "./RequireAuth"
import { Roles } from "../auth/types"
import Landing from "../pages/landing/Landing"

type RoutingProps = {}

const Routing: FunctionComponent<RoutingProps> = ({}) => {
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
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <RequireAuth role={Roles.USER}>
              <Landing />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  )
}

export default Routing
