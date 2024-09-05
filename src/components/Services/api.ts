import { jwtDecode } from 'jwt-decode';
import fetchService from '../../services/api';
import { WorkOrder } from './types';

export const addWorkOrder = async (Description: string, StationId: number) => {
  const token = localStorage.getItem('token');

  type JwtPayload = {
    name: string;
    admin: string;
    exp: number;
    iss: string;
    aud: string;
  };

  if (token) {
    const decodedToken = jwtDecode<JwtPayload>(token);

    // Access the information you need
    const UserId = decodedToken.name;

    const body = {
      StationId,
      UserId,
      Description,
    };

    // Create a new FormData object
    const formData = new FormData();

    // Append key-value pairs from the body object
    Object.keys(body).forEach((key) => {
      formData.append(key, body[key]);
    });
    const response = await fetchService.post('add-history', formData);
    console.log(response);
  }
};

export const getWorkOrders = async () =>
  await fetchService.get<WorkOrder[]>('work-order');
