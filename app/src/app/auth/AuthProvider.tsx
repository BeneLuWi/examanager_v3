import React, { createContext, FunctionComponent, useEffect, useState } from "react"
import { AuthContextType, AuthInfo, Roles } from "./types"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import jwt from "jwt-decode"
import FormData from "form-data"
import { loadAuthFromLocalStorage, saveToLocalStorage } from "./AuthService"

type AuthProviderProps = {
  children?: React.ReactNode
}

export const useAuth = () => {
  return React.useContext(AuthContext)
}

const AuthContext = createContext<AuthContextType>(null!)

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/
  const [auth, setAuth] = useState<AuthInfo | undefined>(loadAuthFromLocalStorage())
  const navigate = useNavigate()

  useEffect(() => {
    if (auth !== undefined) {
      axios
        .get("/api/current_user")
        .then((res) => {
          // if verified --> everything is fine - do nothing
          // console.log("This verified user has a correct token")
        })
        .catch(() => {
          // if token or user invalid --> navigate back to login
          signOut(() => navigate("/"))
        })
    } else console.log("No Access Rights")
  }, [])

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const signIn = (username: string, password: string, success: VoidFunction, failure: VoidFunction) => {
    let loginFormData = new FormData()

    loginFormData.append("grant_type", "password")
    loginFormData.append("username", username)
    loginFormData.append("password", password)

    axios
      .post("api/token", loginFormData)
      .then((res) => {
        const token = res.data["access_token"]
        const decodedTokenAsString: any = jwt(token)
        const role = Roles[decodedTokenAsString["role"]] as unknown as number

        const authInfo = {
          username,
          role,
          token,
        }
        setAuthInfo(authInfo)
        saveToLocalStorage(authInfo)
        success()
      })
      .catch((err) => {
        failure()
        console.error("There was an error", err)
      })
  }

  /**
   * Clear the Axios header, the Context State and Local Storage
   * @param callback Action to perform when Logged out
   */
  const signOut = (callback: VoidFunction) => {
    saveToLocalStorage() // clear local Storage
    setAuth(undefined)
    delete axios.defaults.headers.common["Authorization"]
    callback()
  }

  /**
   * Saves the Authentication Info in the Axios header, the Context State and Local Storage
   * @param authInfo Information to be saved
   */
  const setAuthInfo = (authInfo: AuthInfo) => {
    setAuth(authInfo)
    localStorage.setItem("auth-info", JSON.stringify(authInfo))
    axios.defaults.headers.common["Authorization"] = "Bearer " + authInfo.token
  }

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return <AuthContext.Provider value={{ auth, signIn, signOut }}>{children}</AuthContext.Provider>
}
