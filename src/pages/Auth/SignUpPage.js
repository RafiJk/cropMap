import React from 'react';
import { SignUp } from '../../components/Auth/SignUpComponent';
import Header from '../../components/misc/Header';


const SignUpPage = () => {
  return (
    <div>
      <Header></Header>
      <SignUp />
    </div>
  );
};

export default SignUpPage;