import { FC, FormEvent, useState, KeyboardEvent } from 'react';
import fetchService from '../../../services/api';

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
  const [stations, setStations] = useState<string>('');
  const [stationList, setStationList] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('Def');

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newIds = stations.trim().split(/\s+/);
      const uniqueIds = newIds.filter((id) => id && !stationList.includes(id));
      setStationList([...stationList, ...uniqueIds]);
      setStations('');
    }
  };

  const handleRemoveChip = (id: string) => {
    setStationList(stationList.filter((stationId) => stationId !== id));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const queryParams = new URLSearchParams();
      stationList.forEach((id) => queryParams.append('ids', id));
      queryParams.append('status', selectedStatus);

      const response = await fetchService.get(
        `change-status?${queryParams.toString()}`
      );
      if (response) {
        alert('Status stanica uspesno promenjen!');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label
          htmlFor="large-input"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Stanice
        </label>
        <input
          type="text"
          id="large-input"
          value={stations}
          onChange={(e) => setStations(e.target.value)}
          onKeyDown={handleInputKeyDown}
          className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter station IDs separated by spaces and press Enter"
        />
        <div className="flex flex-wrap mt-2 gap-2">
          {stationList.map((id) => (
            <div
              key={id}
              className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded flex items-center"
            >
              {id}
              <button
                type="button"
                onClick={() => handleRemoveChip(id)}
                className="ml-1 text-blue-500 hover:text-blue-700"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
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
        disabled={selectedStatus === 'Def'}
        className={`my-5 focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${
          selectedStatus === 'Def'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
        }`}
      >
        Promeni
      </button>
    </form>
  );
};

export default ChangeMoreStationsForm;
