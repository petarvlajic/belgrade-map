import { saveAs } from 'file-saver';
import { unparse } from 'papaparse';

export const exportToCSV = (data: unknown[], filename: string): void => {
  const csv = unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};
