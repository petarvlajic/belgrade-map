interface ApiResponse<T> {
  data: T | null;
  error?: string;
  status?: number;
}

const apiUrl = `${location.protocol}//api.test.sodalis.rs/api`;

const fetchService = {
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${apiUrl}/${endpoint}`, {
        headers: {
          cors: 'no-cors',
          // 'Access-Control-Allow-Origin': 'no-cors',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      return {
        data: null,
        error: 'An error occurred while fetching data.',
        status: 401,
      };
    }
  },

  post: async <T>(
    endpoint: string,
    body: BodyInit | undefined
  ): Promise<ApiResponse<T>> => {
    try {
      const token = localStorage.getItem('token');

      const headers = {};

      // If the token exists, add the Authorization header
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      return {
        data: null,
        error: 'An error occurred while posting data.',
        status: 502,
      };
    }
  },
};

export default fetchService;
