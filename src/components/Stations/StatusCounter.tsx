import { FC, useEffect, useRef, useState } from 'react';
import useMarkers from '../../hooks/useMarkers';
import { MarkerType } from '../../types/Marker';

interface Props {
  status: string;
  count: number;
  statusId: number;
}

const StatusCounter: FC<Props> = ({ status, count, statusId }) => {
  const [list, setList] = useState<MarkerType[] | null>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { filteredMarkers, getMarkersByStatus } = useMarkers();

  const showList = () => {
    getMarkersByStatus(statusId);
  };

  useEffect(() => {
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
      <div className=" flex justify-between gap-3 items-center">
        <button
          className="px-4 py-2  text-white rounded hover:text-blue-600 w-full text-left"
          onClick={() => {
            showList();
          }}
        >
          {status && `${status} : ${count}`}
        </button>

        <button
          onClick={() => {
            showList();
            setIsOpen((prev) => !prev);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-down"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 min-w-fit pl-5 bg-dark max-h-52 overflow-y-auto overflow-x-hidden z-50"
        >
          <ol className="list-decimal p-7">
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

export default StatusCounter;
