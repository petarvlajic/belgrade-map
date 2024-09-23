import { FC, useState } from 'react';
import { addWorkOrder } from '../api';
import { User } from '../types';

interface Props {
  users: User[];
}

const AddWorkOrderForm: FC<Props> = ({ users }) => {
  const [formData, setFormData] = useState({
    userId: '',
    stationId: '',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addWorkOrder(
        formData.description,
        formData.stationId,
        formData.userId
      );
      // Reset form or show success message
      setFormData({ userId: '', stationId: '', description: '' });
    } catch (error) {
      console.error('Error submitting work order:', error);
    }
  };

  return (
    <>
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div className="">
          <label
            htmlFor="userId"
            className="mb-2 text-sm font-medium text-gray-900"
          >
            Radnik:
          </label>
          <select
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="bg-gray-50 border capitalize border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Izaberi Korisnika</option>
            {users.map((user) => (
              <option key={user.ID} className="capitalize" value={user.ID}>
                {user.Username}
              </option>
            ))}
          </select>
        </div>
        <div className="">
          <label
            htmlFor="stationId"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            ID Stanice:
          </label>
          <input
            type="number"
            id="stationId"
            name="stationId"
            value={formData.stationId}
            onChange={handleChange}
            aria-describedby="helper-text-explanation"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="90210"
            required
          />
        </div>

        <label
          htmlFor="description"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Opis
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Opisi ukratko kvar..."
        ></textarea>

        <button
          type="submit"
          className="mt-2 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Potvrdi
        </button>
      </form>
    </>
  );
};

export default AddWorkOrderForm;
