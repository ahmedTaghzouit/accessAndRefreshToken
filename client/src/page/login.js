import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useJwt } from 'react-jwt';

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState(false);
  const refreshToken = localStorage.getItem('refreshToken');
  const token = localStorage.getItem('token');
  const { decodedToken } = useJwt(refreshToken);
   
  
  useEffect(() => {
    if (token&&refreshToken && decodedToken && Date.now() < decodedToken.exp * 1000) {
      setAuth(true);
      history.push('/home');
    }
  }, [refreshToken,decodedToken,history]);

 


  const handleRegisterClick = () => {
    history.push('/registre');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/login', {
        email: email,
        password: password,
      });

      const { token, refreshToken } = response.data;

      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      history.push('/home');
    } catch (error) {
      // setEmail(''); 
      // setPassword(''); 
    }
  };

  return (
  <>
    { !auth &&
    <div className="form-container">
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit">Login</button>
      <button type="button" onClick={handleRegisterClick}>
         go to Register
      </button>
    </form>
  </div>
    
}
    </>
  );
  

 
};

export default Login;