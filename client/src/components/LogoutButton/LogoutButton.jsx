import React from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URI } from '../../constants/constants';

const LogoutButton = () => {
  const navigateTo = useNavigate();
  const logoutUser = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    await fetch(API_URI + `/logout/${refreshToken}`, {
      method: 'DELETE',
    });
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigateTo('/login');
  };
  return <input type="button" value="Logout" onClick={logoutUser} />;
};

export default LogoutButton;
