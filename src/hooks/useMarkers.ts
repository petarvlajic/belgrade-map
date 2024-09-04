import { create } from 'zustand';
import { MarkerType } from '../types/Marker';
import fetchService from '../services/api';

interface State {
  markers: MarkerType[] | null;
  filteredMarkers: MarkerType[] | null;
  setMarkers: (markers: MarkerType[] | null) => void;
  setFilteredMarkers: (markers: MarkerType[] | null) => void;
  deleteMarker: (id: number) => void;
  changeMarkerStatus: (id: number, status: number) => void;
  getMarkersByIds: (ids: number[]) => Promise<void>; // Updated return type to void
  getMarkersByStatus: (status: number) => Promise<void>; // Updated return type to void
}

const useMarkers = create<State>((set) => ({
  markers: [],
  filteredMarkers: [],
  setMarkers: (markers: MarkerType[] | null) => set(() => ({ markers })),
  setFilteredMarkers: (markers: MarkerType[] | null) =>
    set(() => ({ filteredMarkers: markers })),
  deleteMarker: (id) =>
    set((state: State) => ({
      markers: state?.markers?.filter((item) => item.id !== id),
    })),
  changeMarkerStatus: (id: number, status: number) =>
    set((state: State) => ({
      markers: state.markers?.map((marker) =>
        marker.id === id ? { ...marker, status } : marker
      ),
    })),
  getMarkersByIds: async (ids: number[]) => {
    const state = useMarkers.getState() as State; // Accessing the state
    const filteredMarkers = ids.length
      ? (ids
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          .map((id) => state.markers?.find((marker) => marker.id === id)!)
          .filter(Boolean) as MarkerType[])
      : null;
    set(() => ({ filteredMarkers })); // Set filteredMarkers state
  },
  getMarkersByStatus: async (status: number) => {
    const state = useMarkers.getState() as State; // Accessing the state
    const response = await fetchService.get(`station/${status}`);
    const filteredMarkers = response.data;
    // state.markers?.filter((marker) => marker.status === status) || null;
    set(() => ({ filteredMarkers }));
  },
}));

export default useMarkers;
