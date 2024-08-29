import { FC, useEffect, useRef, useState } from 'react';
import useMarkers from '../../hooks/useMarkers';
import { MarkerType } from '../../types/Marker';

const ListOffline: FC = () => {
  const [list, setList] = useState<MarkerType[] | null>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { filteredMarkers, getMarkersByStatus } = useMarkers();

  const showList = () => {
    getMarkersByStatus(2);
  };

  useEffect(() => {
    console.log(filteredMarkers);
    setList(filteredMarkers);
  }, [filteredMarkers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full relative">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
        onClick={() => {
          showList();
          setIsOpen((prev) => !prev);
        }}
      >
        Izlistaj offline stanice
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 min-w-fit pl-5 bg-dark max-h-52 overflow-y-auto overflow-x-hidden"
        >
          <ol className="list-decimal p-5">
            {list &&
              list.map((station) => (
                <li key={station.id}>
                  <span className="whitespace-nowrap">
                    {station.name} {station.id} - {station.log}
                  </span>
                </li>
              ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default ListOffline;
