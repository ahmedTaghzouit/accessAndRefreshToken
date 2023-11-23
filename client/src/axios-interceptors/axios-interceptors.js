import axios from 'axios';
const AxiosInstance = axios.create( {
baseURL:'http://localhost:5001'

})

// Add a request interceptor
 AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


AxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
  
      if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        
          const refreshToken =localStorage.getItem('refreshToken');
          const response = await axios.get('http://localhost:5001/refreshToken', {
            headers: {
              'Authorization': `Bearer ${refreshToken}`,
            },
          });
  
          const { token, refreshToken: newRefreshToken } = response.data;
  
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);
          console.log(token,newRefreshToken);
      
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return axios(originalRequest);
        
      }
  
     return Promise.reject(error);
    }
  )
 


export default AxiosInstance