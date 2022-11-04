import React, { FunctionComponent, PropsWithChildren, useState } from "react"
import { Button } from "react-bootstrap"
import { ButtonVariant } from "react-bootstrap/types"
import ModalWrapper from "../modal-wrapper/ModalWrapper"

type ConfirmButtonProps = {
  onSuccess: VoidFunction
  variant: ButtonVariant
  question: string
}

const ConfirmButton: FunctionComponent<PropsWithChildren<ConfirmButtonProps>> = ({
  children,
  onSuccess,
  variant = "danger",
  question,
}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  const [show, setShow] = useState(false)

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  const open = () => setShow(true)
  const close = () => setShow(false)

  const handleSubmit = () => {
    close()
    onSuccess()
  }

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <>
      <Button variant={variant} onClick={open}>
        {children}
      </Button>
      <ModalWrapper size="sm" show={show} close={close} title={question}>
        <div className="d-flex justify-content-around">
          <Button onClick={handleSubmit} variant="primary">
            OK
          </Button>
          <Button onClick={close} variant="secondary">
            Abbrechen
          </Button>
        </div>
      </ModalWrapper>
    </>
  )
}

export default ConfirmButton
