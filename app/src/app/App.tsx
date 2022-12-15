import React, { FunctionComponent } from "react"
import { AuthProvider } from "./auth"
import Routing from "./routing/Routing"
import { ToastContainer } from "react-toastify"
import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const App: FunctionComponent = ({}) => {
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routing />
        <ToastContainer />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
