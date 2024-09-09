'use client';

import { FC, HTMLProps, ReactNode } from 'react';
import { useModalStore } from './hooks/useModal';

interface Props extends HTMLProps<HTMLDivElement> {
  modalKey: string;
  headline: ReactNode;
}

const Modal: FC<Props> = ({ children, modalKey, headline, className }) => {
  const {
    activeModalKey,
    closeModal,
    headline: stateHeadline,
  } = useModalStore();

  if (activeModalKey !== modalKey) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
      onClick={closeModal}
    >
      <div
        className="modal-overlay"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className={` ${
            className?.includes('w-') ? '' : 'w-[95vw]'
          } sm:w-auto max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100vh-70px)] overflow-y-auto bg-white sm:relative rounded-2xl shadow-lg top-3 sm:top-0 fixed overflow-hidden left-1/2 transform -translate-x-1/2 ${className}`}
        >
          {(headline || stateHeadline) && (
            <div className="flex flex-col gap-3 p-4 border-b border-gray-300 sm:flex-row items-start sm:justify-between sm:p-6">
              <div className="flex items-start justify-between w-full lg:w-auto">
                {stateHeadline || (
                  <p className="font-semibold sm:text-[34px] xl:text-4xl">
                    {headline}
                  </p>
                )}
                <button
                  className="bg-[#333333] sm:hidden rounded-[50%] w-[30px] h-[30px] flex items-center justify-center cursor-pointer"
                  onClick={closeModal}
                  aria-label="Close modal"
                >
                  <i className="self-center w-3 h-3 bg-white icon icon-cross" />
                </button>
              </div>

              <button
                className="hidden min-w-[40px] min-h-[40px] font-bold text-white  rounded-md sm:flex modal-close justify-center items-center"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="#000"
                  className="bi bi-x-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
              </button>
            </div>
          )}
          <div className="flex flex-col justify-center p-3 modal-content sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;
