import React from 'react';
import { LogIn } from './LogInComponent'; // Adjust the path to where your LogIn component is located
import Header from '../../components/misc/Header';


const LoginPage = () => {
  return (
    <div>
      <Header></Header>
      <LogIn />
    </div>
  );
};

export default LoginPage;