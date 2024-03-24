import { create } from 'zustand';

interface State {
  showSpinner: boolean;
  setShowSpinner: (markers: boolean) => void;
}

const useSpinner = create<State>((set) => ({
  showSpinner: false,
  setShowSpinner: (value: boolean) => set(() => ({ showSpinner: value })),
}));

export default useSpinner;
