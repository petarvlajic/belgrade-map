import React, { FormEvent, useState } from 'react';
import fetchService from '../../../services/api';

const RestartStationForm = () => {
  const [stations, setStations] = useState<string>('');
  const [stationList, setStationList] = useState<string[]>([]);

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

  const handleRestartAll = async () => {
    if (confirm('KLIKOM NA OVO DUGME CETE RESTARTOVATI SVE UREDJAJE')) {
      const response = await fetchService.get(`resetall`);
      if (response) {
        alert('Stanice uspesno restartovane!');
      }
    } else {
      alert('Restartovanje stanica je otkazano!');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    if (confirm('KLIKOM NA OVO DUGME CETE RESTARTOVATI IZABRANE UREDJAJE')) {
      e.preventDefault();
      try {
        const queryParams = new URLSearchParams();
        stationList.forEach((id) => queryParams.append('ids', id));

        const reqFormData = new FormData();

        console.log(stationList);
        reqFormData.append('id', stationList as any);
        reqFormData.append('command', 'RBT');

        const response = await fetchService.post(`change-command`, reqFormData);
        if (response) {
          alert('Status stanica uspesno promenjen!');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    } else {
      alert('Restartovanje stanica je otkazano!');
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

      <div className=" flex justify-between items-center">
        <button
          disabled={stationList.length === 0}
          type="submit"
          className={` focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5  ${'bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'}`}
        >
          Restart
        </button>
        <button
          type="button"
          onClick={handleRestartAll}
          className=" bg-blue-600 px-5 py-2.5 rounded-lg text-white font-medium text-sm focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Reboot svih online uredjaja
        </button>
      </div>
    </form>
  );
};

export default RestartStationForm;
