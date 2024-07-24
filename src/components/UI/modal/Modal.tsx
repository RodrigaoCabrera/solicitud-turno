import React, { ReactNode, RefObject, useEffect, useRef } from "react";
import "./styles.css";
import { format, parse } from "@formkit/tempo";
import Card from "../appointment/Card";
import CloseIcon from "@/components/icons/CloseIcon";
type HandleModal = {
  handleModal: (action: "open" | "close") => void;
};
interface Appointmentdate {
  calendarDate: string;
  calendarTime: string;
  modality: string;
}
interface ModalProps extends HandleModal {
  dialogRef: React.RefObject<HTMLDialogElement>;
  value: Appointmentdate;
  professionalId: string;
  professionalAddress: string;
}

interface TriggerProps extends HandleModal {
  action: "open" | "close";
  children: ReactNode;
  isSelectedDate?: boolean;
}
export function Modal({
  dialogRef,
  handleModal,
  value,
  professionalId,
  professionalAddress,
}: ModalProps) {
  const addToLocalStorage = () => {
    localStorage.setItem("storedDate", value.calendarDate);
    localStorage.setItem("storedTime", value.calendarTime);
    localStorage.setItem("modality", value.modality);
    localStorage.setItem("professionalId", professionalId);
    localStorage.setItem("professionalAddress", professionalAddress);
  };

  return (
    <dialog
      className="appointment-dialog bg-[#F9FBFD] w-11/12 rounded-2xl max-w-[375px] pt-10 pb-4"
      id="modal"
      ref={dialogRef}
      onClick={() => handleModal("close")}
    >
      <div className="absolute right-3 top-3">
        <CloseIcon width="16" height="16" viewBox="0 0 16 16" fill="none" />
      </div>

      <article
        className="max-w-[297px] mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <section className="mb-3">
          <h3 className="text-m px-2">¡Ya casi tenés tu turno reservado!</h3>
        </section>

        <main className="px-3">
          <Card value={value} professionalAddress={professionalAddress} />
        </main>

        <section className="flex flex-col items-center gap-1 mt-3">
          <div className="w-full">
            <a
              href="/appointments"
              onClick={addToLocalStorage}
              className="w-full text-center inline-block px-3 py-1.5 duration-150 rounded-full border-[1px] border-solid boder-[#94A3B8]"
            >
              Confirmar
            </a>
          </div>

          <div>
            <ModalTrigger handleModal={handleModal} action="close">
              <span>Editar</span>
            </ModalTrigger>
          </div>
        </section>
      </article>
    </dialog>
  );
}

export function ModalTrigger({
  handleModal,
  action,
  children,
  isSelectedDate = true,
}: TriggerProps) {
  return (
    <>
      <button
        onClick={() => handleModal(action)}
        className={`modal-trigger px-3 py-1.5 duration-150 rounded-full  ${
          action === "open"
            ? "text-sm font-semibold uppercase bg-[#D9D9D9] hover:bg-[#cecdcd]"
            : "text-xs text-[#222B45]  underline"
        }`}
        disabled={!isSelectedDate}
        popovertarget={isSelectedDate ? "" : "tooltip"}
      >
        {children}
      </button>

      <div className="modal-tooltip" id="tooltip" popover>
        <p>Debes seleccionar una modalidad y fecha</p>
      </div>
    </>
  );
}
