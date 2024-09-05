import { FC, useEffect, useState } from 'react';
import { getWorkOrders } from './api';
import { WorkOrder } from './types';
import Modal from '../Modal';
import { useModalStore } from '../Modal/hooks/useModal';

const Table: FC = () => {
  const [workOrders, setWorkOrders] = useState<
    WorkOrder[] | null | undefined
  >();

  const { openModal } = useModalStore();

  useEffect(() => {
    const getWorkOrder = async () => {
      const data = await getWorkOrders();
      console.log(data);
      setWorkOrders(data.data ? [data.data[0]] : null);
    };

    getWorkOrder();
  }, []);

  console.log(workOrders);

  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-4 py-3">
            Id
          </th>
          <th scope="col" className="px-4 py-3">
            ID stajalista
          </th>
          <th scope="col" className="px-4 py-3">
            Status
          </th>
          <th scope="col" className="px-4 py-3">
            Opis
          </th>
          <th scope="col" className="px-4 py-3">
            Vreme izdavanja
          </th>
          <th scope="col" className="px-4 py-3">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {workOrders?.map((workOrder, index) => (
          <tr key={index} className="border-b dark:border-gray-700">
            <th
              scope="row"
              className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {workOrder?.Id}
            </th>
            <td className="px-4 py-3">{workOrder?.StationId}</td>
            <td className="px-4 py-3">{workOrder?.StatusLabel}</td>
            <td className="px-4 py-3">{workOrder?.Description}</td>
            <td className="px-4 py-3">{workOrder?.CreatedTime}</td>
            <td>
              {/* {workOrder?.Status == 1 && ( */}
              <button
                type="button"
                onClick={() => openModal('workOrder-fix')}
                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Dodaj Informacije o Popravci
              </button>
              <button
                onClick={() => openModal('workOrder-info')}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Pogledaj Informacije o Popravci
              </button>

              {/* // )} */}
            </td>
          </tr>
        ))}
      </tbody>
      <Modal modalKey="workOrder-fix" headline="Dodaj Informacije o popravci">
        <h2>test</h2>{' '}
      </Modal>
      <Modal modalKey="workOrder-info" headline="Informacije o popravci">
        <h2>test</h2>{' '}
      </Modal>
    </table>
  );
};

export default Table;
