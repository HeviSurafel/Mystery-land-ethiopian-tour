// admin/experiences/components/CreateEditModal.tsx

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { ExperienceForm } from "./ExperienceForm";
import { ApiExperience, ExperienceFormData } from "./types";

interface CreateEditModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  experience: ApiExperience | null;
  onClose: () => void;
  onSubmit: (data: ExperienceFormData, id?: string) => Promise<void>;
  loading?: boolean;
}

export const CreateEditModal = ({
  isOpen,
  mode,
  experience,
  onClose,
  onSubmit,
  loading = false,
}: CreateEditModalProps) => {
  const handleSubmit = async (data: ExperienceFormData) => {
    await onSubmit(data, experience?._id || experience?.id);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-50/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-lg font-semibold text-gray-900">
                      {mode === 'create' ? 'Create New Experience' : 'Edit Experience'}
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  <ExperienceForm
                    initialData={experience}
                    mode={mode}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                    loading={loading}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};