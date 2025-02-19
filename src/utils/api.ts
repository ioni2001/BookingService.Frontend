export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('jwtToken');
  
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  
    const response = await fetch(url, options);
  
    if (!response.ok) {
      throw new Error('Request failed');
    }
  
    return response.json();
  };