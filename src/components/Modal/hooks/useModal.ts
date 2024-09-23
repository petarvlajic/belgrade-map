import { ReactElement } from 'react';
import { create } from 'zustand';

type ModalKeys =
  | 'workOrder-fix'
  | 'workOrder-info'
  | 'add-comment-modal'
  | 'add-work-order'
  | 'change-status'
  | 'get-logs'
  | 'hw-restart'
  | 'plot-form';

type ModalState = {
  openModal: (key: ModalKeys, state?: unknown, headline?: ReactElement) => void;
  closeModal: () => void;
  state: unknown;
  headline: ReactElement | null;
  activeModalKey: ModalKeys | null;
};

// todo generic store
export const useModalStore = create<ModalState>((set) => ({
  activeModalKey: null,
  state: null,
  headline: null,
  openModal: (key, state, headline) =>
    set({ activeModalKey: key, state, headline }),
  closeModal: () => set({ activeModalKey: null, state: null }),
}));
