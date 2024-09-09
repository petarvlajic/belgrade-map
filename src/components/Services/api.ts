import fetchService from '../../services/api';
import { User, WorkOrder } from './types';

export const addWorkOrder = async (
  Description: string,
  StationId: string,
  UserId: string
) => {
  const formData = new FormData();
  formData.append('Description', Description);
  formData.append('StationId', StationId.toString());
  formData.append('UserId', UserId.toString());

  const response = await fetchService.post('add-work-order', formData);
  console.log(response.data);
};

export const getWorkOrders = async () =>
  await fetchService.get<WorkOrder[]>('work-order');

export const getUsers = async () => await fetchService.get<User[]>('users');
