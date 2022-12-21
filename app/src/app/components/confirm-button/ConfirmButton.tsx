import React, { FunctionComponent, PropsWithChildren, useState } from "react"
import { Button } from "react-bootstrap"
import { ButtonVariant } from "react-bootstrap/types"
import ModalWrapper from "../modal-wrapper/ModalWrapper"

type ConfirmButtonProps = {
  onSuccess: VoidFunction
  variant?: ButtonVariant
  question: string
  className?: string
}

const ConfirmButton: FunctionComponent<PropsWithChildren<ConfirmButtonProps>> = ({
  children,
  onSuccess,
  variant = "danger",
  question,
  className,
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
      <Button onClick={open} {...{ className, variant }}>
        {children}
      </Button>
      <ModalWrapper options={{ size: "sm" }} title={question} {...{ show, close }}>
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
