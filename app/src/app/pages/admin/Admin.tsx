import React, { FunctionComponent, useEffect, useState } from "react"
import { AdminContextType, User } from "./types"
import axios from "axios"
import { toast } from "react-toastify"
import UserList from "./UserList"
import NewUser from "./NewUser"

type AdminProps = {}

const AdminContext = React.createContext<AdminContextType>(null!)

export const useAdminContext = () => React.useContext(AdminContext)

const Admin: FunctionComponent<AdminProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [users, setUsers] = useState<User[]>()

  useEffect(() => {
    updateUsers()
  }, [])

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const updateUsers = () => {
    axios
      .get("/api/all_users")
      .then((res) => setUsers(res.data))
      .catch(() => toast("Fehler beim Laden der Nutzer:innen", { type: "error" }))
  }

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <AdminContext.Provider value={{ users, updateUsers }}>
      <div className="page-header">Admin</div>
      <NewUser />
      <UserList />
    </AdminContext.Provider>
  )
}

export default Admin
