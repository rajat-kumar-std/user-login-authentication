import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URI } from '../../constants/constants';

const LoginUser = () => {
  const [userName, setUserName] = React.useState('');
  const [userPassword, setUserPassword] = React.useState('');
  const navigateTo = useNavigate();

  const loginUser = async (event) => {
    event.preventDefault();
    if (userName.trim().length === 0 || userPassword.trim().length === 0) {
      //remove spaces set error message return
      return;
    }

    try {
      const res = await fetch(API_URI + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'Application/json',
        },
        body: JSON.stringify({
          uname: userName,
          password: userPassword,
        }),
      });

      const data = await res.json();
      if (data.error) {
        console.error(data.errorMessage); // maybe show error in setError state in any container
        return;
      }

      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      navigateTo('/dashboard');
    } catch (err) {
      console.error('Somthing bad happend while login:', err.message);
    }
  };

  return (
    <div className="App">
      <p>Login</p>
      <form onSubmit={loginUser}>
        <input
          type="text"
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
          placeholder="Email"
          autoComplete="username"
        />
        <br />
        <input
          type="password"
          onChange={(e) => setUserPassword(e.target.value)}
          value={userPassword}
          placeholder="Enter Password"
          autoComplete="password"
        />
        <input type="submit" value="Login" />
      </form>
      <Link to="/">Home</Link>
    </div>
  );
};

export default LoginUser;
