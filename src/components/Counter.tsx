import { useEffect, useState } from 'react';
import fetchService from '../services/api';
import StatusCounter from './Stations/StatusCounter';

interface Counter {
  status: string;
  count: number;
  statusId: number;
}

const Counter = () => {
  const [counters, setCounters] = useState<Counter[] | undefined | null>(
    undefined
  );

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
          <li className="relative" key={type.status}>
            <StatusCounter
              status={type.status}
              count={type.count}
              statusId={type.statusId}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Counter;
