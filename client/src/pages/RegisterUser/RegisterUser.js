import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URI } from '../../constants/constants';

const RegisterUser = () => {
  const [userName, setUserName] = React.useState('');
  const [userPassword, setUserPassword] = React.useState('');
  const navigateTo = useNavigate();

  const registerUser = async (event) => {
    event.preventDefault();
    if (userName.trim().length === 0 || userPassword.trim().length === 0) {
      //remove spaces set error message return
      return;
    }
    try {
      const res = await fetch(API_URI + '/register', {
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
      if (!data.error) {
        navigateTo('/login');
      }
    } catch (err) {
      console.error('Somthing bad happend while sign up:', err.message);
    }
  };

  return (
    <div className="App">
      <p>Register</p>
      <form onSubmit={registerUser}>
        <input
          type="text"
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
          placeholder="Username"
        />
        <br />
        <input
          type="password"
          onChange={(e) => setUserPassword(e.target.value)}
          value={userPassword}
          placeholder="Create Password"
        />
        <input type="submit" value="Register" />
      </form>
      <Link to="/">Home</Link>
    </div>
  );
};

export default RegisterUser;
