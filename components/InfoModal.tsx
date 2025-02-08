import { useRoutes } from "@/hooks/useRoutes";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React, { Fragment } from "react";
import { IoClose } from "react-icons/io5";
import InfoModalRoute from "./InfoModalRoute";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const routes = useRoutes();
  return (
    <>
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </TransitionChild>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-40">
                <Transition
                  show={isOpen}
                  as={Fragment}
                  enterFrom="translate-x-full"
                  enter="transform transition ease-in-out duration-500"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overscroll-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div
                          className="flex
                          items-start
                          justify-end
                          "
                        >
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              onClick={onClose}
                              type="button"
                              className="rounded-md bg-white text-gray-500
                                hover:text-gray-600
                                focus:outline-none
                                focus:ring-2focus:ring-sky-500
                                focus:ring-offset-2
                                "
                            >
                              <span className="sr-only">Close Panel</span>
                              <IoClose size={28} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex text-slate-700 items-center flex-col mt-8">
                        {routes.map((route) => (
                          <InfoModalRoute
                            key={route.label}
                            href={route.href}
                            active={route.active}
                            label={route.label}
                            onClose={onClose}
                          />
                        ))}
                      </div>
                    </div>
                  </DialogPanel>
                </Transition>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default InfoModal;
