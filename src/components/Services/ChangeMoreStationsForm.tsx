import { FC, FormEvent, useState } from 'react';
import fetchService from '../../services/api';

interface StatusInfo {
  statusId: number;
  status: string;
}

const statusInfoList: StatusInfo[] = [
  { statusId: 0, status: 'Van plana' },
  { statusId: 1, status: 'Online' },
  { statusId: 2, status: 'Offline' },
  { statusId: 3, status: 'Ugašena' },
  { statusId: 4, status: 'Iskopana rupa' },
  { statusId: 5, status: 'Uredjaj sastavljen i rupa iskopana' },
  { statusId: 6, status: 'Sastavljen uredjaj' },
  { statusId: 7, status: 'U planu' },
  { statusId: 8, status: 'Black' },
  { statusId: 9, status: 'U grbu' },
  { statusId: 10, status: 'Nema 220' },
  { statusId: 11, status: 'baterija <25' },
];

const ChangeMoreStationsForm: FC = () => {
  const [stations, setStations] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Def');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const stationIds = stations.split(/\s+/).filter((id) => id.trim() !== '');
      const queryParams = new URLSearchParams();
      stationIds.forEach((id) => queryParams.append('ids', id));
      queryParams.append('status', selectedStatus);

      const response = await fetchService.get(
        `change-status?${queryParams.toString()}`
      );
      console.log(response); // Added to use the response variable
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label
          htmlFor="large-input"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Stanice
        </label>
        <input
          type="text"
          id="large-input"
          value={stations}
          onChange={(e) => setStations(e.target.value)}
          className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <label htmlFor="underline_select" className="sr-only">
        Underline select
      </label>
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        id="underline_select"
        className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
      >
        <option value="Def">Izaberi Status</option>

        {statusInfoList.map((status) => (
          <option
            key={status.statusId}
            className="capitalize"
            value={status.statusId}
          >
            {status.status}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="my-5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Promeni
      </button>
    </form>
  );
};
export default ChangeMoreStationsForm;
