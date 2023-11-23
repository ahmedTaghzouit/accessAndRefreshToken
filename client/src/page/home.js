import { useHistory } from 'react-router-dom';

import UsefetchData from '../hooks/useFitch';

const Home = () => {
  const history = useHistory();

  const {data,authError,isLoading}=UsefetchData("http://localhost:5001/Protected");

  const handleLogout = () => {
    
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    history.push('/login')
    
  };

  if(authError === 'true'){
    history.push('/login');
  }

  return (
    <>
      
      {!isLoading && authError === 'false' && <div>Can't fetch data</div>}
      {!isLoading && authError === null && (
        <div>
          {data && <div>{data}</div>}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </>
  );
};

export default Home;