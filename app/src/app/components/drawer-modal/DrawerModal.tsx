import React, { CSSProperties, FunctionComponent, PropsWithChildren, useRef } from "react"
import { useTransition, a, config } from "@react-spring/web"
import { Button, Container } from "react-bootstrap"

type DrawerModalProps = {
  show: boolean
  close: VoidFunction
}

const drawerStyle: CSSProperties = {
  position: "fixed",
  zIndex: 100,
  width: "85vw",
  height: "100vh",
  top: 0,
  bottom: 0,
  right: 0,
}

const DrawerModal: FunctionComponent<PropsWithChildren<DrawerModalProps>> = ({ children, show, close }) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const modalRef = useRef(null)

  const transition = useTransition(show, {
    from: { transform: "translateX(100px)", opacity: 0 },
    enter: { transform: "translateX(0px)", opacity: 1 },
    leave: { transform: "translateX(100px)", opacity: 0 },
    config: config.gentle,
  })

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
    event.target === modalRef.current && close()

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return transition(
    (styles, item) =>
      item && (
        <a.div
          ref={modalRef}
          onClick={handleClick}
          className="position-absolute w-100 h-100 bg-dark bg-opacity-25 overflow-auto p-2"
          style={{ left: 0, top: 0, opacity: styles.opacity, zIndex: 99 }}
        >
          <a.aside style={{ ...drawerStyle, ...styles }} className="bg-white">
            <Button onClick={close} variant="outline-secondary" className="m-2">
              <i className="display-6 bi bi-x-lg" />
            </Button>
            <Container>{children}</Container>
          </a.aside>
        </a.div>
      )
  )
}

export default DrawerModal
