import { useEffect, useState } from 'react';
import fetchService from '../services/api';
import useMarkers from '../hooks/useMarkers';

interface Counter {
  status: string;
  count: number;
  statusId: number;
}

const Counter = () => {
  const [counters, setCounters] = useState<Counter[] | undefined | null>(
    undefined
  );

  const { getMarkersByStatus } = useMarkers();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await fetchService.get<Counter[]>(`count`);
      setCounters(data);
    };

    fetchData();
  }, []);
  return (
    <div>
      <ul className="font-bold">
        {counters?.map((type) => (
          <li key={type.status}>
            <button
              onClick={() => {
                getMarkersByStatus(type.statusId);
              }}
            >
              {type.status} : {type.count}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Counter;
