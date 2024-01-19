import { useEffect, useState } from "react";
import fetchService from "../services/api";

interface Counter {
  status: string;
  count: number;
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
          <li key={type.status}>
            {type.status} : {type.count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Counter;
