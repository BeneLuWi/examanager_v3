import React, { FunctionComponent } from "react"
import { Route, Routes } from "react-router-dom"
import Login from "../auth/Login"
import Layout from "../layout/Layout"
import RequireAuth from "./RequireAuth"
import { Roles } from "../auth/types"
import Landing from "../pages/landing/Landing"
import SchoolClasses from "../pages/school_classes/SchoolClasses"
import Exams from "../pages/exams/Exams"
import StudentResultList from "../pages/results/StudentResultList"
import Statistics from "../pages/statistics/Statistics"
import Admin from "../pages/admin/Admin"

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
        <Route
          path="classes"
          element={
            <RequireAuth role={Roles.USER}>
              <SchoolClasses />
            </RequireAuth>
          }
        />
        <Route
          path="exams"
          element={
            <RequireAuth role={Roles.USER}>
              <Exams />
            </RequireAuth>
          }
        />
        <Route
          path="statistics"
          element={
            <RequireAuth role={Roles.USER}>
              <Statistics />
            </RequireAuth>
          }
        />
        <Route
          path="admin"
          element={
            <RequireAuth role={Roles.ADMIN}>
              <Admin />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  )
}

export default Routing
