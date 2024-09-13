import { exportToCSV } from '../../lib/csvExport';
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

export const applyAmberAlert = async () => {
  const formData = new FormData();
  formData.append('id', `-1`);
  formData.append('command', 'AMB');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await fetchService.post<any>('change-command', formData);
  console.log(data);
};

export const applyFlag = async () => {
  const formData = new FormData();
  formData.append('id', `-1`);
  formData.append('command', 'FLG');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await fetchService.post<any>('change-command', formData);
  console.log(data);
};

interface FileResponse {
  FileContents: string;
  ContentType: string;
  FileDownloadName: string;
  LastModified: string | null;
  EntityTag: string | null;
  EnableRangeProcessing: boolean;
}

export const getLogs = async (id: string) => {
  const response = await fetchService.get<FileResponse>(`get-log/${id}`);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  const data = response?.data?.data;

  if (data && data.FileContents) {
    console.log('ovo radi');
    const decodedContents = atob(data.FileContents);
    const parsedContents = decodedContents
      .split('\n')
      .map((row) => row.split(','));
    exportToCSV(parsedContents, `${id}-log`);
  }
};
