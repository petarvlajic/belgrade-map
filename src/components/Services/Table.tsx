import { FC, useEffect, useState } from 'react';
import { getWorkOrders } from './api';
import { WorkOrder } from './types';
import Modal from '../Modal';
import { useModalStore } from '../Modal/hooks/useModal';
import AddOrderInfoForm from './Forms/AddOrderInfoForm';

const Table: FC = () => {
  const [workOrders, setWorkOrders] = useState<
    WorkOrder[] | null | undefined
  >();

  const [workOrderState, setWorkOrderState] = useState<WorkOrder | undefined>(
    undefined
  );

  const { openModal } = useModalStore();

  useEffect(() => {
    const getWorkOrder = async () => {
      const data = await getWorkOrders();
      setWorkOrders(data.data ? data.data : null);
    };

    getWorkOrder();
  }, []);

  return (
    <>
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
              <td className="px-4 py-3">{`${
                workOrder?.CreatedTime.split('T')[0]
              } -  ${workOrder?.CreatedTime.split('T')[1]}`}</td>
              <td>
                {workOrder?.Status == 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setWorkOrderState(workOrder);
                        openModal('workOrder-fix');
                      }}
                      className="focus:outline-none w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5  my-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                      Dodaj Informacije o Popravci
                    </button>
                  </>
                )}
                {workOrder?.Status == 2 && (
                  <>
                    <button
                      onClick={() => {
                        setWorkOrderState(workOrder);
                        openModal('workOrder-info');
                      }}
                      type="button"
                      className="text-white mt-2
                       bg-blue-700 w-full hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      Pogledaj Informacije o Popravci
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal modalKey="workOrder-fix" headline="Dodaj Informacije o popravci">
        <AddOrderInfoForm stationId={workOrderState?.Id} />
      </Modal>
      <Modal modalKey="workOrder-info" headline="Informacije o popravci">
        <figure className="max-w-lg">
          <img
            className="h-auto max-w-full rounded-lg"
            src={`http://api.innsoldoo.com/${workOrderState?.pathBefore}`}
            alt="image description"
          />
          <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
            Slika pre popravke
          </figcaption>
        </figure>

        <p>Komentar: {workOrderState?.FixDescription}</p>

        <figure className="max-w-lg">
          <img
            className="h-auto max-w-full rounded-lg"
            src={`http://api.innsoldoo.com/${workOrderState?.pathAfter}`}
            alt="image description"
          />
          <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
            Slika nakon popravke
          </figcaption>
        </figure>
      </Modal>
    </>
  );
};

export default Table;
