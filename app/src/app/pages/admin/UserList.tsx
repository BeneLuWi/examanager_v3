import React, { FunctionComponent } from "react"
import { useAdminContext } from "./Admin"
import { ListGroup } from "react-bootstrap"
import UserItem from "./UserItem"

type UserListProps = {}

const UserList: FunctionComponent<UserListProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const { users } = useAdminContext()

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

  if (!users) return <div>Loading</div>

  return (
    <ListGroup>
      {users.map((user) => (
        <UserItem user={user} key={user._id} />
      ))}
    </ListGroup>
  )
}

export default UserList
