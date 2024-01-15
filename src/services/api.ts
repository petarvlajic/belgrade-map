interface ApiResponse<T> {
  data: T | null;
  error?: string;
}

const apiUrl = "http://alma.sodalis.rs/api";

const fetchService = {
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${apiUrl}/${endpoint}`, {
        headers: {
          cors: "no-cors",
          "Access-Control-Allow-Origin": "no-cors",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      return { data };
    } catch (error) {
      return { data: null, error: "An error occurred while fetching data." };
    }
  },

  post: async <T>(
    endpoint: string,
    body: BodyInit
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${apiUrl}/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: body,
      });

      const data = await response.json();
      return { data };
    } catch (error) {
      return { data: null, error: "An error occurred while posting data." };
    }
  },
};

export default fetchService;
