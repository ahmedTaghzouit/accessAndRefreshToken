import React, { useState,useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useJwt } from 'react-jwt';
const Registre = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const history = useHistory();
  const [auth, setAuth] = useState(false);
  const token = localStorage.getItem('token')
  const refreshToken = localStorage.getItem('refreshToken')
  const { decodedToken } = useJwt(refreshToken);
  
  useEffect(() => {
    if (token&&refreshToken && decodedToken && Date.now() < decodedToken.exp * 1000) {
      history.push('/home');
      setAuth(true);

    }
  }, [refreshToken, decodedToken, history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/registre', {
        username: username,
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
      // setUsername('');
    }
  };

  const handleLoginClick = () => {

   history.push('/login');
  };
    return (
    <>
        {!auth &&(<div className="form-container">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Username:
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
              Email:
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
              Password:
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button type="submit">Register</button>
            <button type="button" onClick={handleLoginClick}>
                      Login
            </button>
            
          </form>
        </div>)}
        </>
      );
}
 
export default Registre;