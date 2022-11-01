import { AuthInfo } from "./types"
import axios from "axios"

/**
 * Loads the locally saved Auth Info and sets the Authorization Header according to the Info
 */
export const loadAuthFromLocalStorage = (): AuthInfo | undefined => {
  const authInfoStr = localStorage.getItem("auth-info")
  if (authInfoStr) {
    const authInfo = JSON.parse(authInfoStr)
    axios.defaults.headers.common["Authorization"] = "Bearer " + authInfo.token
    return {
      username: authInfo.username,
      role: authInfo.role,
      token: authInfo.token,
    }
  }
  return undefined
}

export const saveToLocalStorage = (authInfo?: AuthInfo) => {
  if (authInfo) localStorage.setItem("auth-info", JSON.stringify(authInfo))
  else localStorage.removeItem("auth-info")
}
