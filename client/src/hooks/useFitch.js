import { useState, useEffect } from 'react';
import AxiosInstance from '../axios-interceptors/axios-interceptors';


const UsefetchData = (url) => {

  const [data, setData] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const abortCont = new AbortController();
     AxiosInstance.get(url, { signal: abortCont.signal })
     .then((response)=>{
    setData(response.data);
    setIsLoading(false);
  }).catch((error)=>{
    setIsLoading(false);
    setAuthError('false');
    console.log(isLoading)

    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
      console.log(error.response.data);
      console.log(error.response.status);
      setAuthError('true');
    }
})

}, [url]);
return { data, authError, isLoading };
};



     
   


export default UsefetchData;