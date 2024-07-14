import React, { ReactNode } from "react";
import "./styles.css";
type HandleModal = {
  handleModal: (action: "open" | "close") => void;
};
interface ModalProps extends HandleModal {
  isOpenModal: boolean;
}
interface TriggerProps extends HandleModal {
  action: "open" | "close";
  children: ReactNode;
}
export function Modal({ isOpenModal, handleModal }: ModalProps) {
  return (
    <dialog
      className="modal"
      id="modal"
      open={isOpenModal}
      onClick={() => handleModal("close")}
    >
      <section onClick={(e) => e.stopPropagation()}>
        <h1>¡Ya casi tenés tu turno reservado!</h1>
        <a href="/appointments">Confirmar</a>
        <ModalTrigger handleModal={handleModal} action="close">
          <span>Editar</span>
        </ModalTrigger>
      </section>
    </dialog>
  );
}

export function ModalTrigger({ handleModal, action, children }: TriggerProps) {
  return <button onClick={() => handleModal(action)}>{children}</button>;
}
