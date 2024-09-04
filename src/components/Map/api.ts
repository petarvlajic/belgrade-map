import fetchService from '../../services/api';

export const addComment = async (description: string, id: number) => {
  const body = {
    id,
    description,
    type: 'komentar',
  };

  // Create a new FormData object
  const formData = new FormData();

  // Append key-value pairs from the body object
  Object.keys(body).forEach((key) => {
    formData.append(key, body[key]);
  });
  const response = await fetchService.post('add-history', formData);
  console.log(response);
};
