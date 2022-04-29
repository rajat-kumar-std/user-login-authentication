import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URI } from '../../constants/constants';

import { LogoutButton } from '../../components';

const Dashboard = () => {
  const [post, setPost] = React.useState({ title: '', message: '' });
  const navigateTo = useNavigate();

  const getPosts = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      retryWithRefreshToken();
    }

    try {
      const res = await fetch(API_URI + '/posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (data.error) {
        retryWithRefreshToken();
        return;
      }
      setPost(data.post);
    } catch (err) {
      console.error(
        'Somthing bad happend while verifying your access token:',
        err.message
      );
    }
  };
  React.useEffect(() => {
    getPosts();
    // eslint-disable-next-line
  }, []);

  async function retryWithRefreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return navigateTo('/login');

    try {
      const res = await fetch(API_URI + `/newtoken/${refreshToken}`, {
        method: 'GET',
      });

      const data = await res.json();
      if (data.error) {
        console.error(data.errorMessage);
        navigateTo('/login');
        return;
      }

      localStorage.setItem('access_token', data.accessToken);
      getPosts();
    } catch (err) {
      console.error(
        'Somthing bad happend while verifying your refresh token:',
        err.message
      );
      navigateTo('/login');
    }
  }
  return (
    <>
      <h2>Dashboard</h2>
      <p>Welcome user</p>
      <h3>{post.title}</h3>
      <p>{post.message}</p>
      <LogoutButton />
      <Link to="/">Home</Link>
    </>
  );
};

export default Dashboard;
