import React from 'react';
import { Link } from 'react-router-dom';

const App = () => {
  console.count('App rendered');

  return (
    <div className="App">
      <p>App</p>
      <Link to="/register">Register Page</Link>
      <br />
      <Link to="/login">Login Page</Link>
      <br />
      <Link to="/dashboard">Dashboard</Link>
    </div>
  );
};

export default App;
