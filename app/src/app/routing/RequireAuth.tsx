import React from "react"
import { useAuth } from "../auth"
import { Navigate, useLocation } from "react-router-dom"

const RequireAuth = ({ children, role }: { children: JSX.Element; role: number }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/
  let location = useLocation()
  const { auth } = useAuth()
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

  if (!auth) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role > auth.role) return <div>No access rights</div>

  return children
}

export default RequireAuth
