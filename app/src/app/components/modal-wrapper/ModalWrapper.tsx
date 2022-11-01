import React, { FunctionComponent, PropsWithChildren } from "react"
import { Modal } from "react-bootstrap"

type ModalWrapperProps = {
  children?: React.ReactNode
  show: boolean
  close: VoidFunction
  title: string
  fullscreen?: boolean
}

const ModalWrapper: FunctionComponent<PropsWithChildren<ModalWrapperProps>> = ({
  show,
  close,
  title,
  fullscreen,
  children,
}) => {
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
    <Modal fullscreen={fullscreen ? true : undefined} show={show} size={"xl"} onHide={close} centered>
      <Modal.Header className={"justify-content-between"}>
        <Modal.Title>{title}</Modal.Title>
        <div className="btn btn-icon btn-xl ms-2" aria-label="Close" onClick={close}>
          <i className="bi bi-x fs-1" />
        </div>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  )
}

export default ModalWrapper
