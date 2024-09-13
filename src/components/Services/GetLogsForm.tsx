import { FC, useState, FormEvent } from 'react';
import { getLogs } from './api';

const GetLogsForm: FC = () => {
  const [id, setId] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getLogs(id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="id"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Enter ID
        </label>
        <input
          type="text"
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter ID"
          required
        />
      </div>

      <button
        type="submit"
        className="focus:outline-none mt-3 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Preuzmi
      </button>
    </form>
  );
};

export default GetLogsForm;
