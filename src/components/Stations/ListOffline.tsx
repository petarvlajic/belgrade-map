import { FC, useState } from 'react';
import useMarkers from '../../hooks/useMarkers';
import { MarkerType } from '../../types/Marker';

const ListOffline: FC = () => {
  const [list, setList] = useState<MarkerType[] | null>([]);

  const { filteredMarkers, getMarkersByStatus } = useMarkers();

  const showList = () => {
    getMarkersByStatus(2);
    console.log(filteredMarkers);
    setList(filteredMarkers);
  };
  return (
    <div className="w-full">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
        onClick={() => {
          showList();
        }}
      >
        Izlistaj offline stanice
      </button>
      <ol className=" list-decimal pl-4">
        {list &&
          list.map((station) => (
            <li>
              {station.name} {station.id} - {station.log}
            </li>
          ))}
      </ol>
    </div>
  );
};

export default ListOffline;
