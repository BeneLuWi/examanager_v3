import React, { FunctionComponent, useState } from "react"
import { Button } from "react-bootstrap"
import Form from "react-bootstrap/Form"
import { useAuth } from "./AuthProvider"
import { useLocation, useNavigate } from "react-router-dom"
import { Spring, a, config } from "@react-spring/web"
import { toast } from "react-toastify"

type LoginProps = {}

const Login: FunctionComponent<LoginProps> = () => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/
  let navigate = useNavigate()
  let location = useLocation() as any
  const auth = useAuth()

  const [loading, setLoading] = useState(false)

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/
  let from = location.state?.from?.pathname || "/"

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    let formData = new FormData(event.currentTarget)
    let username = formData.get("username") as string
    let password = formData.get("password") as string

    auth.signIn(
      username,
      password,
      () => {
        // Send them back to the page they tried to visit when they were
        // redirected to the login page. Use { replace: true } so we don't create
        // another entry in the history stack for the login page.  This means that
        // when they get to the protected page and click the back button, they
        // won't end up back on the login page, which is also really nice for the
        // user experience.
        navigate(from, { replace: true })
        setLoading(false)
      },
      () => {
        setTimeout(() => {
          setLoading(false)
          toast("Wrong username or password", { type: "error" })
        }, 2000)
      }
    )
  }

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center vh-100 bg-light">
      <Spring
        from={{ transform: "translate(0px,50px) scale(1)", opacity: 0 }}
        to={{ transform: loading ? "translate(0px, 0px) scale(0.9)" : "translate(0px, 0px) scale(1)", opacity: 1 }}
        config={config.gentle}
      >
        {(styles) => (
          <a.div style={styles}>
            <Form onSubmit={handleSubmit} className="border p-3 rounded bg-white">
              <div className="d-flex flex-column align-items-center mb-3">
                <img src={process.env.PUBLIC_URL + "/logo.png"} alt="Examanager Logo" style={{ width: 200 }} />
              </div>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Name</Form.Label>
                <Form.Control name="username" type="text" placeholder="Enter Username" disabled={loading} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Passwort</Form.Label>
                <Form.Control name="password" type="password" placeholder="Enter Password" disabled={loading} />
              </Form.Group>

              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
          </a.div>
        )}
      </Spring>
    </div>
  )
}

export default Login
