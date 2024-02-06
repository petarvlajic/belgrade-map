import { create } from "zustand";
import { MarkerType } from "../types/Marker";

interface State {
  markers: MarkerType[] | null;
  setMarkers: (markers: MarkerType[] | null) => void;
  deleteMarker: (id: number) => void;
  changeMarkerStatus: (id: number, status: number) => void;
}

const useMarkers = create<State>((set) => ({
  markers: [],
  setMarkers: (markers: MarkerType[] | null) => set(() => ({ markers })),
  deleteMarker: (id) =>
    set((state) => ({
      markers: state?.markers?.filter((item) => item.id !== id),
    })),
  changeMarkerStatus: (id: number, status: number) =>
    set((state) => ({
      markers: state.markers?.map((marker) =>
        marker.id === id ? { ...marker, status } : marker
      ),
    })),
}));

export default useMarkers;
